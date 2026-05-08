import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingHotelPageComponent } from './BookingHotelPage/BookingHotelPage.component';
import { QRCodeComponent } from 'angularx-qrcode';

@NgModule({
  imports: [
    CommonModule, QRCodeComponent
  ],
  declarations: [BookingHotelPageComponent]
})
export class BookingHotelPageModule { }
