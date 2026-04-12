import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Subject, of, throwError } from 'rxjs';
import { PropertyDetail } from '../property-detail';
import { PropertyDetailService } from '../PropertyDetail.service';
import { PropertyReviewsService } from '../PropertyReviews/PropertyReviews.service';
import { PropertyDetailComponent } from './PropertyDetail.component';

describe('PropertyDetailComponent', () => {
  let component: PropertyDetailComponent;
  let fixture: ComponentFixture<PropertyDetailComponent>;
  let queryParams$: Subject<Record<string, string>>;
  let propertyServiceSpy: { getPropertyById: ReturnType<typeof vi.fn> };

  const propertyMock: PropertyDetail = {
    id: 'h1',
    nombre: 'Hotel Test',
    descripcion: 'Descripcion de prueba',
    countryCode: 'CO',
    pais: 'Colombia',
    ciudad: 'Bogota',
    direccion: 'Calle 1 #2-3',
    latitude: 4.711,
    longitude: -74.072,
    rating: 4.5,
    reviews: 25,
    habitaciones: [
      {
        id: 'r1',
        code: 'STD-1',
        descripcion: 'Habitacion estandar',
        capacidad: 2,
        precio: 300000,
        imageUrl: 'https://cdn.test/room.jpg'
      }
    ],
    amenidades: [{ id: 'a1', name: 'WiFi', icon: 'IconWiFi' }],
    imagenes: [{ id: 'i1', url: 'https://cdn.test/image.jpg' }],
    created_at: '2026-01-01',
    updated_at: '2026-01-01'
  };

  const waitForAsyncWork = async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    await new Promise((resolve) => setTimeout(resolve, 0));
  };

  beforeEach(async () => {
    queryParams$ = new Subject<Record<string, string>>();
    propertyServiceSpy = {
      getPropertyById: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [PropertyDetailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { queryParams: queryParams$.asObservable() } },
        { provide: PropertyDetailService, useValue: propertyServiceSpy as Partial<PropertyDetailService> },
        {
          provide: PropertyReviewsService,
          useValue: {
            getReviewsByHospedajeId: () => of([]),
            getReviewsUrl: () => ''
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyDetailComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('shows an error when the id query param is missing', async () => {
    fixture.detectChanges();

    queryParams$.next({} as Record<string, string>);
    await waitForAsyncWork();

    expect(propertyServiceSpy.getPropertyById).not.toHaveBeenCalled();
    expect(component.error).toContain('No se encontró el id de la propiedad');
    expect(component.property).toBeNull();
    expect(component.loading).toBe(false);
  });

  it('loads property detail and sets selected image', async () => {
    localStorage.setItem('navbar_selected_currency', 'USD');
    propertyServiceSpy.getPropertyById.mockReturnValue(of(propertyMock));

    fixture.detectChanges();
    queryParams$.next({ id: 'h1' });
    await waitForAsyncWork();

    expect(propertyServiceSpy.getPropertyById).toHaveBeenCalledWith('h1', 'USD');
    expect(component.property?.id).toBe('h1');
    expect(component.selectedImage).toBe('https://cdn.test/image.jpg');
    expect(component.error).toBe('');
    expect(component.loading).toBe(false);
  });

  it('sets a friendly error when service fails', async () => {
    propertyServiceSpy.getPropertyById.mockReturnValue(
      throwError(() => ({ error: { msg: 'Fallo backend' } }))
    );

    fixture.detectChanges();
    queryParams$.next({ id: 'h1' });
    await waitForAsyncWork();

    expect(component.property).toBeNull();
    expect(component.error).toBe('Fallo backend');
    expect(component.loading).toBe(false);
  });

  it('unsubscribes query params on destroy', () => {
    fixture.detectChanges();
    const subscription = (component as unknown as { queryParamsSubscription?: { unsubscribe: () => void } })
      .queryParamsSubscription;
    const unsubscribeSpy = vi.spyOn(subscription!, 'unsubscribe');

    component.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('updates selected image when selectImage is called', () => {
    component.selectImage('https://cdn.test/another.jpg');
    expect(component.selectedImage).toBe('https://cdn.test/another.jpg');
  });
});
