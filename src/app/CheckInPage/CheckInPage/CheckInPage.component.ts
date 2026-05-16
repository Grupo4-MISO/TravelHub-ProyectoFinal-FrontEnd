import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingHotelPageService } from '../../BookingHotelPage/BookingHotelPage.service';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

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
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {

      const reservaId = params.get('id');

      if (!reservaId) {

        this.cargando = false;
        this.exito = false;

        this.mensaje = 'Reserva inválida';

        this.cdr.detectChanges();

        return;
      }

      const token =
        sessionStorage.getItem('token');

      // No autenticado
      if (!token) {

        this.router.navigate(
          ['/login'],
          {
            queryParams: {
              redirect: `/check-in/${reservaId}`
            }
          }
        );

        return;
      }

      // Ya autenticado
      this.realizarCheckin(reservaId);

    });
  }

  realizarCheckin(reservaId: string): void {

    this.cargando = true;
    this.exito = false;

    this.cdr.detectChanges();

    this.bookingService
      .completarReserva(reservaId)
      .subscribe({

        next: (response) => {

          console.log('CHECKIN OK', response);

          this.reserva = response.reserva;

          this.mensaje = response.msg;

          this.cargando = false;
          this.exito = true;

          this.cdr.detectChanges();
        },

        error: (err) => {

          console.error(err);

          this.cargando = false;
          this.exito = false;

          this.mensaje =
            'No fue posible completar el check-in';

          this.cdr.detectChanges();
        }
      });
  }
}