import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PropertyImagesComponent } from './PropertyImages.component';

describe('PropertyImagesComponent', () => {
  let component: PropertyImagesComponent;
  let fixture: ComponentFixture<PropertyImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyImagesComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyImagesComponent);
    component = fixture.componentInstance;
    component.propertyName = 'Hotel Test';
    component.images = [
      { id: 'i1', url: 'https://cdn.test/1.jpg' },
      { id: 'i2', url: 'https://cdn.test/2.jpg' }
    ];
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('uses first image when selectedImage is empty', () => {
    component.selectedImage = '';
    fixture.detectChanges();

    const mainImage = fixture.nativeElement.querySelector('.main-image') as HTMLImageElement;
    expect(mainImage.src).toContain('https://cdn.test/1.jpg');
  });

  it('emits selected image when a thumbnail is clicked', () => {
    const emitSpy = vi.spyOn(component.imageSelected, 'emit');
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.thumb-btn');
    (buttons[1] as HTMLButtonElement).click();

    expect(emitSpy).toHaveBeenCalledWith('https://cdn.test/2.jpg');
  });

  it('marks selected thumbnail as active', () => {
    component.selectedImage = 'https://cdn.test/2.jpg';
    fixture.detectChanges();

    const activeButtons = fixture.nativeElement.querySelectorAll('.thumb-btn.active');
    expect(activeButtons.length).toBe(1);
  });
});
