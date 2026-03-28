/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LogginPageComponent } from './LogginPage.component';

describe('LogginPageComponent', () => {
  let component: LogginPageComponent;
  let fixture: ComponentFixture<LogginPageComponent>;

  beforeEach(async() => {
      await TestBed.configureTestingModule({
        declarations: [LogginPageComponent]
      }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
