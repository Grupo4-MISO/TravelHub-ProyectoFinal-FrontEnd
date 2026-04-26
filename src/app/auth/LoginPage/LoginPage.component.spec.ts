import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { LoginPageComponent } from './LoginPage.component';
import { AuthService } from '../auth.service';
import { Role } from '../../utilities/Role';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let authServiceSpy: { login: ReturnType<typeof vi.fn> };
  let toastrServiceSpy: { success: ReturnType<typeof vi.fn>; error: ReturnType<typeof vi.fn> };
  let routerSpy: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authServiceSpy = { login: vi.fn() };
    toastrServiceSpy = { success: vi.fn(), error: vi.fn() };
    routerSpy = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      declarations: [LoginPageComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ToastrService, useValue: toastrServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    sessionStorage.clear();
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show validation error and skip login when credentials are empty', () => {
    component.Authlogin('   ', '');

    expect(component.error).toBe('Por favor, ingrese su correo electrónico y contraseña.');
    expect(authServiceSpy.login).not.toHaveBeenCalled();
    expect(toastrServiceSpy.success).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should login successfully, persist session data and navigate to home', () => {
    authServiceSpy.login.mockReturnValue(of({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QtdXNlciIsInJvbGUiOiJUUkFWRUxFUiJ9.signature', user: { id: '25' } }));
    vi.spyOn(component.helper, 'decodeToken').mockReturnValueOnce(
      { username: 'test-user', role: Role.TRAVELER },
    ).mockReturnValueOnce(
      { username: 'test-user', role: Role.TRAVELER }
    ).mockReturnValueOnce(
      { username: 'test-user', role: Role.TRAVELER },
    );

    component.Authlogin('  user@email.com  ', '  secret123  ');

    expect(authServiceSpy.login).toHaveBeenCalledWith({
      email: 'user@email.com',
      password: 'secret123'
    });
    expect(sessionStorage.getItem('token')).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QtdXNlciIsInJvbGUiOiJUUkFWRUxFUiJ9.signature');
    expect(sessionStorage.getItem('idUsuario')).toBe('25');
    expect(sessionStorage.getItem('userName')).toBe('test-user');
    expect(sessionStorage.getItem('role')).toBe(Role.TRAVELER);
    expect(toastrServiceSpy.success).toHaveBeenCalledWith('Has iniciado sesion correctamente.', 'Bienvenido test-user');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    expect(component.error).toBe('');
  });

  it('should show error toast when backend login fails', () => {
    authServiceSpy.login.mockReturnValue(throwError(() => new Error('Unauthorized')));

    component.Authlogin('user@email.com', 'wrong-password');

    expect(component.error).toBe('Usuario o contraseña incorrectos');
    expect(toastrServiceSpy.error).toHaveBeenCalledWith('Usuario o contraseña incorrectos.', 'Error');
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});
