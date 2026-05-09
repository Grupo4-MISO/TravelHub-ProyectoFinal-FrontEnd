import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../auth.service';
import { Role } from '../../utilities/Role';
import { auth } from '../auth';
import { ProviderService } from '../../ProviderPage/provider.service';
import { TravelerService } from '../../TravelerPage/traveler.service';

@Component({
  selector: 'app-LoginPage',
  templateUrl: './LoginPage.component.html',
  styleUrls: ['./LoginPage.component.css'],
  standalone: false,
})
export class LoginPageComponent implements OnInit {
  error: string = '';
  helper = new JwtHelperService();
  redirect: string = '/';
  private queryParams: Record<string, string> = {};

  constructor(
    private authService: AuthService,
    private toastrService: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private providerService: ProviderService,
    private travelerService: TravelerService
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.redirect = params['redirect'] || '/';
      const { redirect, ...rest } = params;
      this.queryParams = rest;
    });
    sessionStorage.setItem('decodedToken', '');
    sessionStorage.setItem('token', '');
    sessionStorage.setItem('idUsuario', '');
    sessionStorage.setItem('provider_id', '');
    sessionStorage.setItem('name', '');
    sessionStorage.setItem('documentNumber', '');
    sessionStorage.setItem('providerStatus', '');
  }

  Authlogin(email: string, password: string) {

    this.error = '';

    const normalizedEmail = email.trim();
    const normalizedPassword = password.trim();

    if (
      normalizedEmail.length === 0 ||
      normalizedPassword.length === 0
    ) {

      this.error =
        'Por favor, ingrese su correo electrónico y contraseña.';

      return;
    }

    const credentials: auth = {
      email: normalizedEmail,
      password: normalizedPassword,
    };

    this.authService.login(credentials).subscribe({

      next: (res) => {

        const decoded =
          this.helper.decodeToken(res.token);

        const role = decoded.role;

        // SESSION STORAGE
        sessionStorage.setItem(
          'decodedToken',
          JSON.stringify(decoded)
        );

        sessionStorage.setItem('token', res.token);

        sessionStorage.setItem(
          'userName',
          decoded.username
        );

        sessionStorage.setItem(
          'idUsuario',
          res.user.id
        );

        sessionStorage.setItem(
          'role',
          role
        );

        this.toastrService.success(
          'Has iniciado sesión correctamente.',
          'Bienvenido ' + decoded.username
        );

        // ADMIN
        if (role == Role.ADMIN) {

          this.router.navigateByUrl(this.redirect);

          return;
        }

        // TRAVELER
        if (role == Role.TRAVELER) {

          this.travelerService
            .getTravelerByUserId(res.id)
            .subscribe({

              next: (traveler) => {

                sessionStorage.setItem(
                  'traveler_id',
                  traveler.id
                );

                sessionStorage.setItem(
                  'name',
                  traveler.first_name + ' ' + traveler.last_name
                );

                sessionStorage.setItem(
                  'documentNumber',
                  traveler.documentNumber
                );

                sessionStorage.setItem(
                  'travelerStatus',
                  traveler.travelerStatus
                );

                this.router.navigateByUrl(this.redirect);
              },

              error: () => {

                this.router.navigateByUrl(this.redirect);
              },
            });

          return;
        }

        // PROVIDER / MANAGER
        if (
          role == Role.MANAGER ||
          role == Role.ACCOMODATION
        ) {

          this.providerService
            .getProviderByUserId(res.id)
            .subscribe({

              next: (provider) => {

                sessionStorage.setItem(
                  'provider_id',
                  provider.id
                );

                sessionStorage.setItem(
                  'name',
                  provider.name
                );

                sessionStorage.setItem(
                  'documentNumber',
                  provider.documentNumber
                );

                sessionStorage.setItem(
                  'providerStatus',
                  provider.providerStatus
                );

                this.router.navigateByUrl(this.redirect);
              },

              error: () => {

                this.router.navigateByUrl(this.redirect);
              },
            });

          return;
        }

        // fallback
        this.router.navigateByUrl(this.redirect);
      },

      error: () => {

        this.error =
          'Usuario o contraseña incorrectos';

        this.toastrService.error(
          'Usuario o contraseña incorrectos.',
          'Error'
        );
      },
    });
  }
}
