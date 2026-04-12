import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PropertyDetail } from '../property-detail';
import { PropertyDetailService } from '../PropertyDetail.service';
import { PropertyImagesComponent } from '../PropertyImages/PropertyImages.component';
import { PropertyInfoComponent } from '../PropertyInfo/PropertyInfo.component';
import { PropertyMapComponent } from '../PropertyMap/PropertyMap.component';
import { PropertyRoomsComponent } from '../PropertyRooms/PropertyRooms.component';
import { PropertyAmenitiesComponent } from '../PropertyAmenities/PropertyAmenities.component';
import { PropertyReviewsComponent } from '../PropertyReviews/PropertyReviews.component';
import { PropertyAvailabilityComponent } from '../PropertyAvailability/PropertyAvailability.component';

@Component({
  selector: 'app-PropertyDetailPage',
  templateUrl: './PropertyDetail.component.html',
  styleUrls: ['./PropertyDetail.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    PropertyImagesComponent,
    PropertyInfoComponent,
    PropertyMapComponent,
    PropertyRoomsComponent,
    PropertyAmenitiesComponent,
    PropertyReviewsComponent,
    PropertyAvailabilityComponent
  ]
})
export class PropertyDetailComponent implements OnInit, OnDestroy {
  property: PropertyDetail | null = null;
  selectedImage: string = '';
  loading: boolean = false;
  error: string = '';
  check_in: string = '';
  check_out: string = '';
  capacidad: number | null = null;
  private queryParamsSubscription?: Subscription;
  private route = inject(ActivatedRoute);
  private propertyService = inject(PropertyDetailService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
      setTimeout(() => {
        const id = params['id'];
        this.check_in = params['check_in'] || params['checkIn'] || '';
        this.check_out = params['check_out'] || params['checkOut'] || '';
        this.capacidad = params['capacidad'] ? Number(params['capacidad']) : null;
        const localCurrency = localStorage.getItem('navbar_selected_currency') || 'COP';
        if (!id) {
          this.property = null;
          this.error = 'No se encontró el id de la propiedad en la URL.';
          this.loading = false;
          return;
        }

        this.fetchProperty(id, localCurrency);
      }, 0);
    });
  }

  ngOnDestroy(): void {
    this.queryParamsSubscription?.unsubscribe();
  }

  private fetchProperty(id: string, localCurrency: string): void {
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    this.propertyService.getPropertyById(id, localCurrency).subscribe({
      next: (data) => {
        setTimeout(() => {
          this.property = {
            ...data,
            imagenes: data.imagenes ?? [],
            habitaciones: data.habitaciones ?? [],
            amenidades: data.amenidades ?? []
          };
          this.selectedImage = this.property.imagenes?.[0]?.url || this.property.habitaciones?.[0]?.imageUrl || '';
          this.loading = false;
          this.cdr.detectChanges();
        }, 0);
      },
      error: (err) => {
        setTimeout(() => {
          this.property = null;
          this.error = err?.error?.msg || err?.error?.message || 'No fue posible cargar el detalle del hospedaje.';
          this.loading = false;
          this.cdr.detectChanges();
        }, 0);
      }
    });
  }

  selectImage(url: string): void {
    this.selectedImage = url;
  }
}
