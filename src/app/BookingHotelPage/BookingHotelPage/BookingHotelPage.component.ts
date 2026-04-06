// BookingHotelPage.component.ts
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap, map, startWith } from 'rxjs/operators';
import { BookingHotelPageService } from '../BookingHotelPage.service';
import { ActivatedRoute } from '@angular/router';

type HotelVm = {
  loading: boolean;
  nombre: string;
  direccion: string;
  pais: string;
};

@Component({
  selector: 'app-BookingHotelPage',
  templateUrl: './BookingHotelPage.component.html',
  styleUrls: ['./BookingHotelPage.component.css'],
  standalone: false
})
export class BookingHotelPageComponent implements OnInit {
  username: string | null = null;
  idHotel: string = '';
  hotelVm$!: Observable<HotelVm>;
  roomsVm$!: Observable<any[]>;
  reservationsVm$!: Observable<any>;

  constructor(
    private bookingService: BookingHotelPageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.username = sessionStorage.getItem('userName');
    this.uploadHotel();
  }

  get modo(): string {
    let mode = this.route.snapshot.queryParamMap.get('mode') || '';
    switch (mode) {
      case 'rooms':
        return 'habitaciones';
      case 'reservations':
        return 'reservas';
      default:
        return '';
    }
  };

  uploadHotel(): void {
    if (!this.username) {
      this.hotelVm$ = of({ 
        loading: false, 
        nombre: 'Hotel no disponible', 
        direccion: 'Dirección no disponible', 
        pais: 'País no disponible'
      });
      return;
    }
    this.hotelVm$ = this.bookingService.identificarHospedaje(this.username).pipe(
      tap((hotel: any)=>{
        this.idHotel = hotel?.id ? hotel.id.toString() : '';
        this.uploadRooms();
      }),
      map((hotel: any) => ({
        loading: false,
        nombre: hotel?.nombre ?? 'Hotel no disponible',
        direccion: hotel?.direccion ?? 'Dirección no disponible',
        pais: hotel?.pais ?? 'País no disponible'    })),
      startWith({
        loading: true,
        nombre: '',
        direccion: '',
        pais: ''
      }),
      catchError(() =>
        of({
          loading: false,
          nombre: 'Hotel no disponible',
          direccion: 'Dirección no disponible',
          pais: 'País no disponible',
        })
      )
    );
  }

  uploadRooms(): void {
    if (!this.idHotel) {
      this.roomsVm$ = of([]);
      return;
    }
    this.roomsVm$ = this.bookingService.listarHabitaciones(this.idHotel).pipe(
      catchError(() => of([]))
    );
  }

}
