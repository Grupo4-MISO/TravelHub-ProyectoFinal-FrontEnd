import { SearchBarService } from '../../searchbar/searchbar.service';
import { SearchBar } from '../../searchbar/searchbar';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Inject } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ResultsPage',
  templateUrl: './ResultsPage.component.html',
  styleUrls: ['./ResultsPage.component.css'],
  standalone: false
})

export class ResultsPageComponent implements OnInit, OnDestroy {
  resultados: SearchBar[] = [];
  loading: boolean = false;
  error: string = '';
  private queryParamsSubscription?: Subscription;
  private isSearching: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private searchService: SearchBarService,
    @Inject(ToastrService) private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) { }

  buscar(ciudad: string, check_in: string, check_out: string, capacidad: number, country_code: string, currency_code: string) {
    if (this.isSearching) return;
    this.isSearching = true;
    this.error = '';
    this.loading = true;
    this.cdr.detectChanges();

    this.searchService.buscarHospedajes(ciudad, check_in, check_out, capacidad, country_code, currency_code)
      .subscribe({
        next: (data) => {
          this.resultados = data;
          console.log('Resultados obtenidos:', this.resultados);
          this.loading = false;
          this.isSearching = false;
          this.toastr.success('Hospedajes encontrados', '', { positionClass: 'toast-bottom-right' });
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = err?.error?.msg || 'Error al buscar hospedajes';
          this.loading = false;
          this.isSearching = false;
          this.toastr.error(this.error, '', { positionClass: 'toast-bottom-right' });
          this.cdr.detectChanges();
        }
      });
  }

  getStarArray(rating: number): number[] {
    return Array(Math.floor(rating));
  }

  getEmptyStarArray(rating: number): number[] {
    return Array(5 - Math.floor(rating));
  }

  ngOnInit() {
    this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
      const { ciudad, check_in, check_out, capacidad, country_code, currency_code } = params;
      if (ciudad && check_in && check_out && capacidad && country_code && currency_code) {
        this.buscar(ciudad, check_in, check_out, capacidad, country_code, currency_code);
      }
    });
  }

  ngOnDestroy() {
    this.queryParamsSubscription?.unsubscribe();
  }
}