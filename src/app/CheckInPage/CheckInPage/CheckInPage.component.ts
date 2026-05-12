import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingHotelPageService } from '../../BookingHotelPage/BookingHotelPage.service';

@Component({
  selector: 'app-checkin-page',
  templateUrl: './CheckInPage.component.html',
  styleUrls: ['./CheckInPage.component.css'],
  standalone: false
})
export class CheckinPageComponent implements OnInit {

  cargando = true;
  exito = false;

  mensaje = '';

  reserva: any = null;

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingHotelPageService
  ) {}

  ngOnInit(): void {

    const reservaId =
      this.route.snapshot.paramMap.get('id');

    if (!reservaId) {

      this.cargando = false;
      this.exito = false;

      this.mensaje = 'Reserva inválida';

      return;
    }

    this.bookingService
      .completarReserva(reservaId)
      .subscribe({

        next: (response) => {

          this.reserva = response.reserva;

          this.mensaje = response.msg;

          this.cargando = false;
          this.exito = true;
        },

        error: () => {

          this.cargando = false;
          this.exito = false;

          this.mensaje =
            'No fue posible completar el check-in';
        }
      });
  }
}