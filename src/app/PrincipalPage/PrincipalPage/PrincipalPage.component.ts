import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { PopularAccommodation } from '../popular-accommodation';
import { PrincipalPageService } from '../principal-page.service';
import { NavbarService } from '../../navbar/navbar.service';

@Component({
  selector: 'app-PrincipalPage',
  templateUrl: './PrincipalPage.component.html',
  styleUrls: ['./PrincipalPage.component.css'],
  standalone: false
})
export class PrincipalPageComponent implements OnInit, OnDestroy {
  popularAccommodations: PopularAccommodation[] = [];
  loadingPopular: boolean = false;
  errorPopular: string = '';

  private subscriptions = new Subscription();

  constructor(
    private router: Router,
    private principalPageService: PrincipalPageService,
    private navbarService: NavbarService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const savedCountryCode = this.navbarService.getSavedCountryId();
    if (savedCountryCode) {
      this.fetchPopularAccommodations(savedCountryCode);
    }

    this.subscriptions.add(
      this.navbarService.country$.subscribe(country => {
        if (country) {
          this.fetchPopularAccommodations(country.code);
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private fetchPopularAccommodations(countryCode: string): void {
    this.loadingPopular = true;
    this.errorPopular = '';
    this.popularAccommodations = [];
    this.cdr.detectChanges();

    this.principalPageService.getPopularAccommodations(countryCode).subscribe({
      next: (data) => {
        this.popularAccommodations = data;
        this.loadingPopular = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingPopular = false;
        this.errorPopular = 'No se pudieron cargar las propiedades destacadas.';
        this.toastr.error($localize`:error:No se pudieron cargar las propiedades destacadas.`, '', { positionClass: 'toast-bottom-right' });
        this.cdr.detectChanges();
      }
    });
  }

  verDetallePopular(id: string): void {
    this.router.navigate(['/property'], { queryParams: { id } });
  }

  getStarArray(rating: number): number[] {
    return Array(Math.floor(rating));
  }

  getEmptyStarArray(rating: number): number[] {
    return Array(5 - Math.floor(rating));
  }
}
