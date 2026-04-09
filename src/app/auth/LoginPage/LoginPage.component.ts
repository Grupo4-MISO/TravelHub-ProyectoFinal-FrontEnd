import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../auth.service';
import { Role } from '../../utilities/Role';
import { auth } from '../auth';

@Component({
  selector: 'app-LoginPage',
  templateUrl: './LoginPage.component.html',
  styleUrls: ['./LoginPage.component.css'],
  standalone: false,
})
export class LoginPageComponent implements OnInit {
  error: string = '';
  helper = new JwtHelperService();

  constructor(
    private authService: AuthService,
    private toastrService: ToastrService,
    private router: Router,
  ) {}

  ngOnInit() {
    sessionStorage.setItem('decodedToken', '');
    sessionStorage.setItem('token', '');
    sessionStorage.setItem('idUsuario', '');
  }

  Authlogin(email: string, password: string) {
    this.error = '';
    const normalizedEmail = email.trim();
    const normalizedPassword = password.trim();

    if (normalizedEmail.length === 0 || normalizedPassword.length === 0) {
      this.error = 'Por favor, ingrese su correo electrónico y contraseña.';
      return;
    }

    const credentials: auth = {
      email: normalizedEmail,
      password: normalizedPassword,
    };
    this.authService.login(credentials).subscribe(
      (res) => {
        sessionStorage.setItem('decodedToken', JSON.stringify(this.helper.decodeToken(res.token)));
        sessionStorage.setItem('token', res.token);
        sessionStorage.setItem('userName', this.helper.decodeToken(res.token).username);
        sessionStorage.setItem('idUsuario', res.id);
        const role = this.helper.decodeToken(res.token).role;
        sessionStorage.setItem('role', role);
        this.toastrService.success('Has iniciado sesion correctamente.', 'Bienvenido ' + this.helper.decodeToken(res.token).username);

        if (role == Role.ADMIN) {
          // this.router.navigate([`/admin`, res.id]);
        }
        if (role == Role.TRAVELER) {
          // this.router.navigate([`/Traveler/ByUserId`,res.id]);
        }
        if (role == Role.MANAGER) {
          // this.router.navigate([`/Manager/ByUserId`,res.id]);
        }
        this.router.navigate([`/`]);
      },
      (error) => {
        this.error = 'Usuario o contraseña incorrectos';
        this.toastrService.error('Usuario o contraseña incorrectos.', 'Error');
      },
    );
  }
}
