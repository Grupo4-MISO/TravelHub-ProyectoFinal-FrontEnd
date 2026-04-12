import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { PropertyMapComponent } from './PropertyMap.component';

describe('PropertyMapComponent', () => {
  let component: PropertyMapComponent;
  let fixture: ComponentFixture<PropertyMapComponent>;
  let sanitizer: DomSanitizer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyMapComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyMapComponent);
    component = fixture.componentInstance;
    sanitizer = TestBed.inject(DomSanitizer);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('returns null mapUrl when coordinates are missing', () => {
    component.latitude = 0;
    component.longitude = 0;

    expect(component.mapUrl).toBeNull();
    expect(component.openMapUrl).toBe('');
  });

  it('builds sanitized mapUrl and openMapUrl when coordinates exist', () => {
    const sanitizeSpy = vi.spyOn(sanitizer, 'bypassSecurityTrustResourceUrl');
    component.latitude = 4.711;
    component.longitude = -74.072;

    component.mapUrl;
    const openMapUrl = component.openMapUrl;

    expect(sanitizeSpy).toHaveBeenCalled();
    const sanitizedArg = sanitizeSpy.mock.calls.at(-1)?.[0] as string;
    expect(sanitizedArg).toContain('openstreetmap.org/export/embed.html');
    expect(sanitizedArg).toContain('marker=4.711,-74.072');
    expect(openMapUrl).toContain('openstreetmap.org/?mlat=4.711');
  });

  it('renders no map message when mapUrl is null', () => {
    component.latitude = 0;
    component.longitude = 0;
    fixture.detectChanges();

    const rootText = fixture.nativeElement.textContent as string;
    expect(rootText).toContain('No fue posible cargar el mapa.');
  });
});
