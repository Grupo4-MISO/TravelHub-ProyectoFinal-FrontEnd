import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { LoginPageComponent } from './LoginPage.component';
import { AuthService } from '../auth.service';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginPageComponent],
      providers: [
        {
          provide: AuthService,
          useValue: new Proxy({}, {
            get: () => vi.fn().mockReturnValue(of({}))
          })
        },
        {
          provide: ToastrService,
          useValue: new Proxy({}, {
            get: () => vi.fn()
          })
        },
        {
          provide: Router,
          useValue: { navigate: vi.fn() }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { queryParams: {} },
            queryParams: of({})
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;

    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});