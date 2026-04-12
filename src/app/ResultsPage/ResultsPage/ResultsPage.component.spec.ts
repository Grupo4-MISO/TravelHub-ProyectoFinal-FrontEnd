/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { SearchBarComponent } from '../../searchbar/searchbar/searchbar.component';
import { ResultsPageComponent } from './ResultsPage.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrService } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchBar } from '../../searchbar/searchbar';

describe('ResultsPageComponent', () => {
  let component: ResultsPageComponent;
  let search_bar_component!: SearchBarComponent;
  let fixture: ComponentFixture<ResultsPageComponent>;
  let debug: DebugElement;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [ResultsPageComponent, SearchBarComponent],
      imports: [RouterTestingModule, ReactiveFormsModule],
      providers: [
  {
    provide: ToastrService,
      useValue: {
        success: () => {},
        error: () => {},
        warning: () => {},
        info: () => {}
      }
    }
  ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsPageComponent);
    component = fixture.componentInstance;
    component.loading = false;

    // Creamos 10 cards de resultados para probar
    for(let i = 0; i < 10; i++){
      const hospedaje: SearchBar = {
        habitacion_id: `habitacion_${i}`,
        hospedaje_id: `hospedaje_${i}`,
        code: `CODE${i}`,
        nombre: `Hotel ${i}`,
        pais: `País ${i}`,
        ciudad: `Ciudad ${i}`,
        direccion: `Dirección ${i}`,
        rating: Math.floor(Math.random() * 5) + 1,
        reviews: Math.floor(Math.random() * 100) + 1,
        capacidad: Math.floor(Math.random() * 4) + 1,
        precio: Math.floor(Math.random() * 200) + 50,
        descripcion: `Descripción del Hotel ${i}`,
        currency_code: 'USD',
        image_url: `https://via.placeholder.com/250x150?text=Hotel+${i}`,
      };
      component.resultados.push(hospedaje);
    }
    fixture.detectChanges();
    debug = fixture.debugElement;
    search_bar_component = fixture.debugElement.query(By.directive(SearchBarComponent)).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Validaciones de searchbar en ResultsPage
  it('should create', () => {
    expect(search_bar_component).toBeTruthy();
  });

  // Validaciones de resultados
  it('should display the correct number of resultados', () => {
    expect(debug.queryAll(By.css('.hotel-card')).length).toBe(10);
  });

  it('should display 10 images of hotels', () => {
    expect(debug.queryAll(By.css('.card-image')).length).toBe(10);
  });

  it('should display 10 hotel names', () => {
    expect(debug.queryAll(By.css('.hotel-name')).length).toBe(10);
  });

  it('should display 10 hotel cities', () => {
    expect(debug.queryAll(By.css('.city')).length).toBe(10);
  });

  it('should display 10 hotel rooms info', () => {
    expect(debug.queryAll(By.css('.room-info')).length).toBe(10);
  });

  it('should display 10 hotel ratings', () => {
    expect(debug.queryAll(By.css('.stars')).length).toBe(10);
  });

  it('should display 10 hotel prices', () => {
    expect(debug.queryAll(By.css('.price')).length).toBe(10);
  });

  it('should display 10 hotel button availability', () => {
    expect(debug.queryAll(By.css('.btn-primary')).length).toBe(10);
  });
});
