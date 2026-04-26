import { Component, OnInit } from '@angular/core';
import { ReservationsPageService } from '../ReservationsPage.service';
import { firstValueFrom } from 'rxjs';
import { ChangeDetectorRef, AfterViewInit } from '@angular/core';
import * as bootstrap from 'bootstrap';


interface Usuario{
  id: string;
  first_name: string;
  last_name:string;
  email: string;
  country: string;
  gender: string;
}

interface Reserva{
  id: string;
  public_id: string;
  habitacion_id: string;
  id_visual_habitacion: string;
  check_in: string;
  check_out: string;
  valor: number;
  estado: string;
  nombre_hotel: string;
  pais_hotel: string;
  ciudad_hotel: string;
  direccion_hotel: string;
  imagen: string;
}

interface Hotel{
  nombre: string;
  pais: string;
  ciudad: string;
  direccion: string;
  imagen: string;
}

@Component({
  selector: 'app-ReservationsPage',
  templateUrl: './ReservationsPage.component.html',
  styleUrls: ['./ReservationsPage.component.css'],
  standalone: false
})
export class ReservationsPageComponent implements OnInit, AfterViewInit {
  usuario: Usuario | null = null;
  reservaActiva: Reserva | null = null;
  reservas: Reserva[] = [];

  offcanvasReserva: bootstrap.Offcanvas | null = null;
  modalReserva: bootstrap.Modal | null = null;


  constructor(
    private reservationsService: ReservationsPageService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void{
    this.inicializar();
  }

  private async inicializar(): Promise<void> {
    await this.cargarUsuario();
    await this.cargarReservas();
    await this.cargarHoteles();
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

  async cargarUsuario() {
    try{
        const uuid = sessionStorage.getItem('idUsuario');
        const usuario_activo = await firstValueFrom(this.reservationsService.identificarUsuario(uuid!));
        this.usuario = usuario_activo;
        this.cdr.detectChanges();
    } catch (error) {
        console.error('Error al cargar el usuario:', error);
    }
  }

  async cargarReservas() {
    try{
        const uuid = sessionStorage.getItem('idUsuario');
        const reservas_usuario = await firstValueFrom(this.reservationsService.cargarReservas(uuid!));
        this.reservas = reservas_usuario;
        this.cdr.detectChanges();
    } catch (error) {
        console.error('Error al cargar las reservas:', error);
    }   
  }

  async cargarHoteles() {
    const habitaciones_ids = this.reservas.map(r => r.habitacion_id);
    const hoteles_dict = await firstValueFrom(
      this.reservationsService.cargarHoteles(habitaciones_ids));
    
    for (const reserva of this.reservas) {
      const hotel = hoteles_dict[reserva.habitacion_id] as Hotel;
      reserva.nombre_hotel = hotel.nombre;
      reserva.pais_hotel = hotel.pais;
      reserva.ciudad_hotel = hotel.ciudad;
      reserva.direccion_hotel = hotel.direccion;
      reserva.imagen = hotel.imagen;
      this.cdr.detectChanges();
    }  
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

  mostrar_modal(): void {
    this.modalReserva?.show();
  }

  ocultar_modal(): void {
    this.modalReserva?.hide();
  }

  cancelar_reserva(): void{
    if (!this.reservaActiva) return;
    this.reservationsService.cancelarReserva(this.reservaActiva.id).subscribe({ 
      next: (response) => {
        this.ocultar_reserva();
        this.inicializar();
      }});
    this.ocultar_modal();
  }

}
