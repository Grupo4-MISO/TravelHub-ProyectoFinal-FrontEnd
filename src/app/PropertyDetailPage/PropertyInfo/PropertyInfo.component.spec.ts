import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PropertyDetail } from '../property-detail';
import { PropertyInfoComponent } from './PropertyInfo.component';

describe('PropertyInfoComponent', () => {
  let component: PropertyInfoComponent;
  let fixture: ComponentFixture<PropertyInfoComponent>;

  const propertyMock: PropertyDetail = {
    id: 'h1',
    nombre: 'Hotel Test',
    descripcion: 'Descripcion',
    countryCode: 'CO',
    pais: 'Colombia',
    ciudad: 'Bogota',
    direccion: 'Calle 123',
    latitude: 4.7,
    longitude: -74.1,
    rating: 4.2,
    reviews: 10,
    habitaciones: [],
    amenidades: [],
    imagenes: [],
    created_at: '2026-01-01',
    updated_at: '2026-01-01'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyInfoComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyInfoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('builds filled and empty star arrays based on floor rating', () => {
    expect(component.getStarArray(4.9).length).toBe(4);
    expect(component.getEmptyStarArray(4.9).length).toBe(1);
  });

  it('renders property info when input is present', () => {
    component.property = propertyMock;
    fixture.detectChanges();

    const rootText = fixture.nativeElement.textContent as string;
    expect(rootText).toContain('Hotel Test');
    expect(rootText).toContain('Bogota, Colombia');
    expect(rootText).toContain('4.2 (10 reseñas)');
  });
});
