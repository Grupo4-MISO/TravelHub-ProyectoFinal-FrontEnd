
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BookingHotelPageService } from '../BookingHotelPage.service';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { PropertyDetailService } from '../../PropertyDetailPage/PropertyDetail.service';
import { PaymentService } from '../../PaymentPage/Payment.service';
import * as bootstrap from 'bootstrap';


interface Hotel {
  id: string;
  nombre: string;
  direccion: string;
  pais: string;
}

interface Habitacion {
  habitacion_id: string;
  id_visual: string;
  descripcion: string;
  capacidad: number;
  precio: number;
  reservas: Reserva[];
}

interface Reserva {
  id: string;
  public_id: string;
  habitacion_id: string;
  user_id: string;
  id_visual_habitacion: string;
  valor: number;
  moneda: string;
  check_in: string;
  check_out: string;
  estado: string;
  usuario: Usuario | null;
  visible: boolean;
}

interface Usuario {
  id: string;
  first_name: string;
  last_name: string;
  country: string;
  email: string;
}

@Component({
  selector: 'app-BookingHotelPage',
  templateUrl: './BookingHotelPage.component.html',
  styleUrls: ['./BookingHotelPage.component.css'],
  standalone: false
})
export class BookingHotelPageComponent implements OnInit, AfterViewInit {
  username: string | null = null;

  hotel: Hotel | null = null;
  habitaciones: Habitacion[] = [];
  reservas: Reserva[] = [];
  
  cargandoHotel = false;
  cargandoHabitaciones = false;
  cargandoReservas = false;  
  
  reservaActiva: Reserva | null = null;
  accionModal: string = '';

  offcanvasReserva: bootstrap.Offcanvas | null = null;
  canvasBuscar: bootstrap.Offcanvas | null = null;
  modalReserva: bootstrap.Modal | null = null;

  reservasFiltradas: Reserva[] = [];
  filtroActivo: boolean = false;
  qrUrl: string = '';

  constructor(
    private bookingService: BookingHotelPageService,
    private propertyDetailService: PropertyDetailService,
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit(): void {
    this.username = sessionStorage.getItem('userName');
    this.cargarHotelYListas();
  }

  ngAfterViewInit(): void {
    const offcanvasElement = document.getElementById('detalleReserva');
    if (offcanvasElement) {
      this.offcanvasReserva = new bootstrap.Offcanvas(offcanvasElement);
    }
    const modalElement = document.getElementById('staticBackdrop');
    if (modalElement) {
      this.modalReserva = new bootstrap.Modal(modalElement);
    }
    const canvasBuscarElement = document.getElementById('canvasBuscar');
    if (canvasBuscarElement) {
      this.canvasBuscar = new bootstrap.Offcanvas(canvasBuscarElement);
    }
  }

  get modo(): string {
    const mode = this.route.snapshot.queryParamMap.get('mode') || '';
    if (mode === 'rooms') return 'habitaciones';
    if (mode === 'reservations') return 'reservas';
    return '';
  }

  private async cargarHotelYListas(): Promise<void> {
    if (!this.username) {
      this.hotel = null;
      this.habitaciones = [];
      return;
    }

    this.cargandoHotel = true;
    this.cargandoHabitaciones = true;
    this.cargandoReservas = true;

    try {
      const uuid_hotel = sessionStorage.getItem('idUsuario');
      const hotel = await firstValueFrom(
        this.propertyDetailService.getPropertyById(uuid_hotel!,"COP")
      ) as Hotel;

      this.hotel = hotel ?? null;
      this.cargandoHotel = false;
      this.cdr.detectChanges();

      const idHotelId = hotel?.id ?? null;
      if (!idHotelId) {
        this.habitaciones = [];
        return;
      }

      const rooms = await firstValueFrom(
        this.bookingService.listarHabitaciones(idHotelId)
      ) as Habitacion[];

      this.habitaciones = rooms ?? [];
      this.cdr.detectChanges();

      const listaHabitaciones = this.idHabitaciones();
      if (listaHabitaciones.length > 0) {
        const reservas = await firstValueFrom(
          this.bookingService.obtenerReservas(listaHabitaciones)
        ) as Reserva[];
        reservas.sort((a, b) => new Date(a.check_in).getTime() - new Date(b.check_in).getTime());
        this.reservas = reservas ?? [];
        this.cargandoReservas = false;
        this.cdr.detectChanges();
      }

      this.actualizarHabitaciones();
      this.cdr.detectChanges();
      this.actualizarReservas();
      this.cdr.detectChanges();
      
      this.cargarUsuarios();
      this.cargarPagos();

    } catch (e) {
      this.hotel = null;
      this.habitaciones = [];
      console.error('Error cargando booking page', e);
    }
    }

    private async cargarUsuarios(){
      const reservasConUsuario = this.reservas.filter(r => r.user_id);
      for (let reserva of reservasConUsuario) {
        try {
          const usuario = await firstValueFrom(
            this.bookingService.obtenerUsuario(reserva.user_id)
          ) as Usuario;
          reserva.usuario = usuario;
        } catch (e) {
          console.error('Error cargando usuario para reserva ' + reserva.id, e);
        }}
      
      this.cdr.detectChanges();
    }

    idHabitaciones(): string[] {
      return this.habitaciones.map(h => h.habitacion_id);
    }

    actualizarHabitaciones(): void {
      for (let habitacion of this.habitaciones) {
        const reservasHabitacion = this.reservas.filter(r => r.habitacion_id === habitacion.habitacion_id);
        reservasHabitacion.sort((a, b) => new Date(a.check_in).getTime() - new Date(b.check_in).getTime());
        habitacion.reservas = reservasHabitacion;
        habitacion.id_visual = this.habitaciones.indexOf(habitacion) + 101 + "";
      }
    }

    actualizarReservas(): void {
      for (let reserva of this.reservas) {
        const habitacion = this.habitaciones.find(h => h.habitacion_id === reserva.habitacion_id);
        reserva.id_visual_habitacion = habitacion ? habitacion.id_visual : "N/A";
        reserva.valor = habitacion ? habitacion.precio * this.dar_dias(reserva.check_in, reserva.check_out) : 0;
        reserva.visible = true;
      }}

    dar_dias(check_in: string, check_out: string): number {
      const fechaCheckIn = new Date(check_in);
      const fechaCheckOut = new Date(check_out);
      const diferenciaTiempo = fechaCheckOut.getTime() - fechaCheckIn.getTime();
      const dias = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24));
      return dias;
    }

    private async cargarPagos(){
      for (let reserva of this.reservas) {
        try {
          const pagos = await firstValueFrom(
            this.paymentService.getpaymentbyReserve(reserva.id)
          ) as any;
          const pago = pagos?.[0];
          if (pago?.amount) {
            reserva.valor = Number(pago.amount);
            reserva.moneda = pago.currency
          }
          this.cdr.detectChanges();
        } catch (e) {}
    }}

    ver_reserva(reserva: Reserva, fila: HTMLTableRowElement): void {
      this.qrUrl = `${this.bookingService.reservas_url}/check-in/${reserva.id}`;
      
      const filas = document.querySelectorAll('.active_reserve');
      filas.forEach(f => f.classList.remove('active_reserve'));

      if (this.reservaActiva && this.reservaActiva.id === reserva.id) {
        this.ocultar_reserva();
        return;
      }

      this.reservaActiva = reserva;
      fila.classList.add('active_reserve');
      this.offcanvasReserva?.show();

    }

    ocultar_reserva(): void {
      this.offcanvasReserva?.hide();
      const filas = document.querySelectorAll('.active_reserve');
      filas.forEach(f => f.classList.remove('active_reserve'));
      this.reservaActiva = null;
    }

    confirmar_reserva(): void{
      if (!this.reservaActiva) return;
      this.bookingService.confirmarReserva(this.reservaActiva.id).subscribe({ 
        next: (response) => {
          this.ocultar_reserva();
          this.cargarHotelYListas();
        }});
      this.ocultar_modal();
    }

    revocar_reserva(): void{
      if (!this.reservaActiva) return;
      this.bookingService.revocarReserva(this.reservaActiva.id).subscribe({ 
        next: (response) => {
          this.ocultar_reserva();
          this.cargarHotelYListas();
        }});
      this.ocultar_modal();
    }

    mostrar_modal(accion: string): void {
      this.accionModal = accion;
      if (accion === 'confirmar') {
        const modalTitle = document.getElementById('staticBackdropLabel');
        const modalBody = document.getElementById('Modalbody');
        const titulo = $localize`:@@confirmarReserva:Confirmar Reserva` + ' ' + this.reservaActiva?.public_id;
        const mensaje = $localize`:@@confirmarReservaMsg:¿Está seguro de confirmar la reserva seleccionada?`
        if (modalTitle) modalTitle.textContent = titulo;
        if (modalBody) modalBody.textContent = mensaje;
      }
      else if (accion === 'revocar') {
        const modalTitle = document.getElementById('staticBackdropLabel');
        const modalBody = document.getElementById('Modalbody');
        const titulo = $localize`:@@revocarReserva:Revocar Reserva` + ' ' + this.reservaActiva?.public_id;
        const mensaje = $localize`:@@revocarReservaMsg:¿Está seguro de revocar la reserva seleccionada? Esta acción no es reversible.`
        if (modalTitle) modalTitle.textContent = titulo;
        if (modalBody) modalBody.textContent = mensaje;
      }
      this.modalReserva?.show();
    }

    ocultar_modal(): void {
      this.modalReserva?.hide();
    }

    mostrar_filtros(): void {
      this.canvasBuscar?.show();
      this.manejarFiltros();
    }

    ocultar_filtros(): void {
      this.canvasBuscar?.hide();
      if (!this.filtroActivo) {
        this.removerFiltros();
      }
    }

    get correosViajeros(): string[] {
      const correos = this.reservas
        .map(reserva => reserva.usuario?.email)
        .filter(email => email !== undefined) as string[];  
        return Array.from(new Set(correos));
      
    }

    manejarFiltros(): void{
      const codigoInput = (document.getElementById('codigo') as HTMLInputElement)?.value.trim() || '';
      const habitacionInput = (document.getElementById('habitacion') as HTMLInputElement)?.value.trim() || '';
      const fechaInInput = (document.getElementById('checkIn') as HTMLInputElement)?.value || '';
      const fechaOutInput = (document.getElementById('checkOut') as HTMLInputElement)?.value || '';
      const correoInput = (document.getElementById('correoViajero') as HTMLInputElement)?.value.trim() || '';
      var estadoInput = (document.getElementById('estadoReserva') as HTMLInputElement)?.value.trim() || '';

      if (estadoInput === $localize`:@@seleccionaEstado:Selecciona un estado`) {
        estadoInput = '';
      }

      this.reservasFiltradas = this.reservas

      if(codigoInput){
        this.resaltar_input('codigo');
        this.reservasFiltradas = this.reservasFiltradas.filter(
          r => r.public_id.toLowerCase().includes(codigoInput.toLowerCase()));
      } else {
        this.desmarcar_input('codigo');
      }

      if(habitacionInput){
        this.resaltar_input('habitacion');
        this.reservasFiltradas = this.reservasFiltradas.filter(
          r => r.id_visual_habitacion.toLowerCase().includes(habitacionInput.toLowerCase()));
      } else {
        this.desmarcar_input('habitacion');
      }

      if(fechaInInput){
        this.resaltar_input('checkIn');
        this.reservasFiltradas = this.reservasFiltradas.filter(
          r => r.check_in === fechaInInput);
      } else {
        this.desmarcar_input('checkIn');
      }

      if(fechaOutInput){
        this.resaltar_input('checkOut');
        this.reservasFiltradas = this.reservasFiltradas.filter(
          r => r.check_out === fechaOutInput);
      } else {
        this.desmarcar_input('checkOut');
      }

      if(correoInput){
        this.resaltar_input('correoViajero');
        this.reservasFiltradas = this.reservasFiltradas.filter(
          r => r.usuario?.email === correoInput);
      } else {
        this.desmarcar_input('correoViajero');
      }

      if(estadoInput){
        this.resaltar_input('estadoReserva');
        this.reservasFiltradas = this.reservasFiltradas.filter(
          r => r.estado === estadoInput);
      } else {
        this.desmarcar_input('estadoReserva');
      }

      this.mapearSalida();

    }

    private resaltar_input(inputId: string): void {
      const input = document.getElementById(inputId) as HTMLInputElement;
      input.style.backgroundColor = '#FFF2CC';
    }

    private desmarcar_input(inputId: string){
      const input = document.getElementById(inputId) as HTMLInputElement;
      input.style.backgroundColor = '';
    }

    private mapearSalida(): void {
      const salida = document.getElementById('resultadoFiltros');
      const encontradas = this.reservasFiltradas.length
      var texto = $localize`:@@reservasCoinciden:${encontradas} reservas coinciden con los criterios de búsqueda.`;

      if (encontradas === this.reservas.length) {
        texto = '';
      }

      if (salida) {
        salida.textContent = texto;
        if (encontradas === 0) {
          salida.classList.add('text-danger');
          salida.classList.remove('text-success');
        } else {
          salida.classList.add('text-success');
          salida.classList.remove('text-danger');
        }
      }
      
    }

    aplicarFiltros(): void {
      if(this.reservasFiltradas.length === this.reservas.length){
        this.ocultar_filtros();
        return;
      }
      for (let reserva of this.reservas) {
        reserva.visible = this.reservasFiltradas.includes(reserva);
      } 
      this.filtroActivo = true;
      this.ocultar_filtros();
      this.activar_head_filtrado();
    }

    removerFiltros(): void {
      for (let reserva of this.reservas) {
        reserva.visible = true;
      }
      this.filtroActivo = false;
      this.desactivar_head_filtrado();
      const codigoInput = document.getElementById('codigo') as HTMLInputElement;
      const habitacionInput = document.getElementById('habitacion') as HTMLInputElement;
      const fechaInInput = document.getElementById('checkIn') as HTMLInputElement;
      const fechaOutInput = document.getElementById('checkOut') as HTMLInputElement;
      const correoInput = document.getElementById('correoViajero') as HTMLInputElement;
      const estadoInput = document.getElementById('estadoReserva') as HTMLInputElement;
      const salida = document.getElementById('resultadoFiltros');

      if (codigoInput) codigoInput.value = '';
      if (habitacionInput) habitacionInput.value = '';
      if (fechaInInput) fechaInInput.value = '';
      if (fechaOutInput) fechaOutInput.value = '';
      if (correoInput) correoInput.value = '';
      if (estadoInput) estadoInput.value = $localize`:@@seleccionaEstado:Selecciona un estado`;
      if (salida) salida.textContent = '';
    }

    activar_head_filtrado(): void {
      const header = document.getElementById('headerReservas');
      if (header) {
        header.classList.add('header-filtrado');
        header.innerText = this.texto_filtros();
      }
    }

    desactivar_head_filtrado(): void {
      const header = document.getElementById('headerReservas');
      if (header) {
        header.classList.remove('header-filtrado');
        header.innerText = $localize`:@@reservas:Reservas`;
      }
    }

    private texto_filtros(): string {
      const codigoInput = (document.getElementById('codigo') as HTMLInputElement)?.value.trim() || '';
      const habitacionInput = (document.getElementById('habitacion') as HTMLInputElement)?.value.trim() || '';
      const fechaInInput = (document.getElementById('checkIn') as HTMLInputElement)?.value || '';
      const fechaOutInput = (document.getElementById('checkOut') as HTMLInputElement)?.value || '';
      const correoInput = (document.getElementById('correoViajero') as HTMLInputElement)?.value.trim() || '';
      var estadoInput = (document.getElementById('estadoReserva') as HTMLInputElement)?.value.trim() || '';

      if (estadoInput === $localize`:@@seleccionaEstado:Selecciona un estado`) {
        estadoInput = '';
      }

      var resutado = $localize`:@@reservasEncontradasPara:Reservas encontradas para: `

      if(codigoInput){
        resutado += `Código "${codigoInput}" `
      }

      if(habitacionInput){
        resutado += `Habitación "${habitacionInput}" `
      }

      if(fechaInInput){
        resutado += `Check-in "${fechaInInput}" `
      }

      if(fechaOutInput){
        resutado += `Check-out "${fechaOutInput}" `
      }

      if(correoInput){
        resutado += `Correo "${correoInput}" `
      }

      if(estadoInput){
        resutado += `Estado "${estadoInput}" `
      }

      return resutado
    }

  }
