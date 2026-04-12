import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PropertyRoomsComponent } from './PropertyRooms.component';

describe('PropertyRoomsComponent', () => {
  let component: PropertyRoomsComponent;
  let fixture: ComponentFixture<PropertyRoomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyRoomsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyRoomsComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('uses COP as local currency by default', () => {
    localStorage.removeItem('navbar_selected_currency');
    expect(component.localCurrency).toBe('COP');
  });

  it('reads local currency from localStorage', () => {
    localStorage.setItem('navbar_selected_currency', 'USD');
    expect(component.localCurrency).toBe('USD');
  });

  it('renders empty state when no rooms are available', () => {
    component.rooms = [];
    fixture.detectChanges();

    const rootText = fixture.nativeElement.textContent as string;
    expect(rootText).toContain('No hay habitaciones disponibles');
  });

  it('renders one card per room and shows local currency', () => {
    localStorage.setItem('navbar_selected_currency', 'EUR');
    component.rooms = [
      {
        id: 'r1',
        code: 'STD-1',
        descripcion: 'Estandar',
        capacidad: 2,
        precio: 100,
        imageUrl: 'https://cdn.test/room-1.jpg'
      },
      {
        id: 'r2',
        code: 'DLX-1',
        descripcion: 'Deluxe',
        capacidad: 3,
        precio: 150,
        imageUrl: 'https://cdn.test/room-2.jpg'
      }
    ];

    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('.room-card');
    const rootText = fixture.nativeElement.textContent as string;

    expect(cards.length).toBe(2);
    expect(rootText).toContain('EUR / noche');
  });
});
