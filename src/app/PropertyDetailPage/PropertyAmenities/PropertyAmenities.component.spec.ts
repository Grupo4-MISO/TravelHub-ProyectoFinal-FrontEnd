import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PropertyAmenitiesComponent } from './PropertyAmenities.component';

describe('PropertyAmenitiesComponent', () => {
  let component: PropertyAmenitiesComponent;
  let fixture: ComponentFixture<PropertyAmenitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyAmenitiesComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyAmenitiesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('returns mapped material icon for known key', () => {
    expect(component.getAmenityMaterialIcon('IconWiFi')).toBe('wifi');
  });

  it('returns default material icon for unknown key', () => {
    expect(component.getAmenityMaterialIcon('UnknownIcon')).toBe('check_circle');
  });

  it('renders an amenity chip for each amenity', () => {
    component.amenities = [
      { id: 'a1', name: 'WiFi', icon: 'IconWiFi' },
      { id: 'a2', name: 'Piscina', icon: 'IconPiscina' }
    ];

    fixture.detectChanges();

    const chips = fixture.nativeElement.querySelectorAll('.amenity-chip');
    expect(chips.length).toBe(2);
  });
});
