import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-BookingHotelPage',
  templateUrl: './BookingHotelPage.component.html',
  styleUrls: ['./BookingHotelPage.component.css'],
  standalone: false
})
export class BookingHotelPageComponent implements OnInit {
  username: string | null = null;

  constructor() { }

  ngOnInit() {
    this.username = sessionStorage.getItem('userName');
  }

}
