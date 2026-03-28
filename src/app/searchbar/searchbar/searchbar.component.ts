import { SearchBarService } from "../../searchbar/searchbar.service";
import {SearchBar} from "../../searchbar/searchbar";
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css'],
  standalone: false
})

export class SearchbarComponent implements OnInit {
  // Definimos variables de inicializacion
  propiedades: Array<SearchBar> = [];

  constructor(
    private searchBarService: SearchBarService,
    private routerPath: Router
  ) { }

  ngOnInit() {
    this.searchBarService.buscarHospedajes
  }

}
