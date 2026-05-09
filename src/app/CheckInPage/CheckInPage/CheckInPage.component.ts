import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingHotelPageService } from '../../BookingHotelPage/BookingHotelPage.service';
import { Router } from '@angular/router';

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

  reserva: any = null;

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingHotelPageService,
    private router: Router
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

    // Validamos si existe sesión
    const token = sessionStorage.getItem('token');

    // Si NO hay token -> login
    if (!token) {

      this.router.navigate(
        ['/login'],
        {
          queryParams: {
            redirect: `/checkin/${reservaId}`
          }
        }
      );

      return;
    }

    // Si SI hay token -> ejecutar checkin
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