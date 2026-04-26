
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BookingHotelPageService } from '../BookingHotelPage.service';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { PropertyDetailService } from '../../PropertyDetailPage/PropertyDetail.service';
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
  check_in: string;
  check_out: string;
  estado: string;
  usuario: Usuario | null;
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
  modalReserva: bootstrap.Modal | null = null;

  constructor(
    private bookingService: BookingHotelPageService,
    private propertyDetailService: PropertyDetailService,
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
      }}

    dar_dias(check_in: string, check_out: string): number {
      const fechaCheckIn = new Date(check_in);
      const fechaCheckOut = new Date(check_out);
      const diferenciaTiempo = fechaCheckOut.getTime() - fechaCheckIn.getTime();
      const dias = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24));
      return dias;
    }

    ver_reserva(reserva: Reserva, fila: HTMLTableRowElement): void {
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
        const titulo = 'Confirmar Reserva ' + this.reservaActiva?.public_id;
        const mensaje = '¿Está seguro de confirmar la reserva seleccionada?'
        if (modalTitle) modalTitle.textContent = titulo;
        if (modalBody) modalBody.textContent = mensaje;
      }
      else if (accion === 'revocar') {
        const modalTitle = document.getElementById('staticBackdropLabel');
        const modalBody = document.getElementById('Modalbody');
        const titulo = 'Revocar Reserva ' + this.reservaActiva?.public_id;
        const mensaje = '¿Está seguro de revocar la reserva seleccionada? Esta acción no es reversible.'
        if (modalTitle) modalTitle.textContent = titulo;
        if (modalBody) modalBody.textContent = mensaje;
      }
      this.modalReserva?.show();
    }

    ocultar_modal(): void {
      this.modalReserva?.hide();
    }
  }
