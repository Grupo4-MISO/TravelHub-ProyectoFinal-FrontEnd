/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ReservationsPageComponent } from './ReservationsPage/ReservationsPage.component';

describe('ReservationsPageComponent', () => {
  let component: ReservationsPageComponent;
  let fixture: ComponentFixture<ReservationsPageComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ ReservationsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
