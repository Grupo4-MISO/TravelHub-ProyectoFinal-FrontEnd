import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingHotelPageService } from '../../BookingHotelPage/BookingHotelPage.service';

@Component({
  selector: 'app-checkin-page',
  templateUrl: './CheckInPage.component.html',
  styleUrls: ['./CheckInPage.component.css'],
  standalone: false
})
export class CheckInPageComponent implements OnInit {

  cargando = true;
  exito = false;
  mensaje = '';
  codigoReserva = '';

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingHotelPageService
  ) {}

  ngOnInit(): void {

    const reservaId = this.route.snapshot.paramMap.get('id');

    if (!reservaId) {
      this.cargando = false;
      this.exito = false;
      this.mensaje = 'Reserva inválida';
      return;
    }

    this.codigoReserva = reservaId;

    this.bookingService.completarReserva(reservaId)
      .subscribe({
        next: () => {
          this.cargando = false;
          this.exito = true;
          this.mensaje = 'Tu check-in ha sido registrado exitosamente';
        },
        error: () => {
          this.cargando = false;
          this.exito = false;
          this.mensaje = 'No fue posible completar el check-in';
        }
      });
  }
}