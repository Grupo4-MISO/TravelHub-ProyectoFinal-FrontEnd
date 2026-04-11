import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PropertyDetail } from '../property-detail';
import { PropertyDetailPageService } from '../PropertyDetailPage.service';

@Component({
  selector: 'app-PropertyDetailPage',
  templateUrl: './PropertyDetailPage.component.html',
  styleUrls: ['./PropertyDetailPage.component.css'],
  standalone: false
})
export class PropertyDetailPageComponent implements OnInit, OnDestroy {
  private readonly amenityMaterialIconMap: Record<string, string> = {
    IconWiFi: 'wifi',
    IconDesayuno: 'free_breakfast',
    IconEstacionamiento: 'local_parking',
    IconPiscina: 'pool',
    IconGimnasio: 'fitness_center',
    IconRoomService: 'room_service',
    IconSpa: 'spa',
    IconRestaurante: 'restaurant',
    IconPlayaPrivada: 'beach_access',
    IconBar: 'local_bar',
    IconTerraza: 'deck',
    IconTodoIncluido: 'all_inclusive',
    IconKidsClub: 'child_care',
    IconPlaya: 'beach_access',
    IconSnorkel: 'scuba_diving',
    IconBusinessCenter: 'business_center',
    IconChimenea: 'fireplace',
    IconJardin: 'yard',
    IconTourCafetero: 'emoji_nature',
    IconSenderismo: 'hiking'
  };

  property: PropertyDetail | null = null;
  selectedImage: string = '';
  loading: boolean = false;
  error: string = '';
  private queryParamsSubscription?: Subscription;
  private route = inject(ActivatedRoute);
  private propertyService = inject(PropertyDetailPageService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
      setTimeout(() => {
        const id = params['id'] ?? params['hospedajeId'];

        if (!id) {
          this.property = null;
          this.error = 'No se encontró el id de la propiedad en la URL.';
          this.loading = false;
          return;
        }

        this.fetchProperty(id);
      }, 0);
    });
  }

  ngOnDestroy(): void {
    this.queryParamsSubscription?.unsubscribe();
  }

  private fetchProperty(id: string): void {
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    this.propertyService.getPropertyById(id).subscribe({
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

  getStarArray(rating: number): number[] {
    return Array(Math.floor(rating));
  }

  getEmptyStarArray(rating: number): number[] {
    return Array(5 - Math.floor(rating));
  }

  getAmenityMaterialIcon(iconKey: string): string {
    return this.amenityMaterialIconMap[iconKey] ?? 'check_circle';
  }
}
