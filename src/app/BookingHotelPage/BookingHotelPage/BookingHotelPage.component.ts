// BookingHotelPage.component.ts
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BookingHotelPageService } from '../BookingHotelPage.service';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';

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
  id_visual: string;
  habitacion_id: string;
  id_visual_habitacion: string;
  valor: number;
  check_in: string;
  check_out: string;
  estado: string;
}

@Component({
  selector: 'app-BookingHotelPage',
  templateUrl: './BookingHotelPage.component.html',
  styleUrls: ['./BookingHotelPage.component.css'],
  standalone: false
})
export class BookingHotelPageComponent implements OnInit {
  username: string | null = null;

  hotel: Hotel | null = null;
  habitaciones: Habitacion[] = [];
  reservas: Reserva[] = [];

  cargandoHotel = false;
  cargandoHabitaciones = false;
  cargandoReservas = false;  


  constructor(
    private bookingService: BookingHotelPageService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.username = sessionStorage.getItem('userName');
    this.cargarHotelYListas();
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
      const hotel = await firstValueFrom(
        this.bookingService.identificarHospedaje(this.username)
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
        this.reservas = reservas ?? [];
        this.cargandoReservas = false;
        this.cdr.detectChanges();
      }

      this.actualizarHabitaciones();
      this.cdr.detectChanges();
      this.actualizarReservas();
      this.cdr.detectChanges();

    } catch (e) {
      this.hotel = null;
      this.habitaciones = [];
      console.error('Error cargando booking page', e);
    }
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
        reserva.id_visual = "RSV-" + (this.reservas.indexOf(reserva) + 201);
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

}
