import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchBar } from '../searchbar';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css'],
  standalone: false
})

export class SearchBarComponent implements OnInit {

  searchForm!: FormGroup;
  loading: boolean = false;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private routerPath: Router
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      ciudad: ['', Validators.required],
      check_in: ['', Validators.required],
      check_out: ['', Validators.required],
      capacidad: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ResultsPage(): void {
    this.routerPath.navigate(['/results']);
  }

  buscar(): void {
  if (this.searchForm.invalid) {
    this.searchForm.markAllAsTouched();
    return;
  }

  const { ciudad, check_in, check_out, capacidad } = this.searchForm.value;

  this.routerPath.navigate(['/results'], {
      queryParams: {
        ciudad,
        check_in,
        check_out,
        capacidad
      }
    });
  }
}