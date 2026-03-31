/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { SearchBarComponent } from '../../searchbar/searchbar/searchbar.component';
import { ResultsPageComponent } from './ResultsPage.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrService } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';

describe('ResultsPageComponent', () => {
  let component: ResultsPageComponent;
  let fixture: ComponentFixture<ResultsPageComponent>;

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
