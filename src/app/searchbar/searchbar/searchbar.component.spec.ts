/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchBarComponent } from './searchbar.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [SearchBarComponent],
      imports: [ReactiveFormsModule, RouterTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create the form', () => {
    expect(component.searchForm).toBeTruthy();
  });

  it('should be invalid when empty', () => {
    expect(component.searchForm.valid).toBeFalsy();
  });

  it('should be valid when all fields are filled', () => {
    component.searchForm.setValue({
      ciudad: 'Bogota',
      check_in: '2024-07-01',
      check_out: '2024-07-10',
      capacidad: 2
    });
    expect(component.searchForm.valid).toBeTruthy();
  });

  it('should disable button if form is invalid', () => {
    const button = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBeTruthy();
  });

  it('should call buscar() on form submit', () => {
    vi.spyOn(component, 'buscar');

    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    expect(component.buscar).toHaveBeenCalled();
  });
});
