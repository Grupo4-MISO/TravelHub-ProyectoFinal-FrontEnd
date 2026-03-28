/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { SearchbarComponent } from '../searchbar/searchbar.component';
import { PrincipalPageComponent } from './PrincipalPage.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('PrincipalPageComponent', () => {
  let component: PrincipalPageComponent;
  let fixture: ComponentFixture<PrincipalPageComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [PrincipalPageComponent, SearchbarComponent],
      imports: [RouterTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrincipalPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
