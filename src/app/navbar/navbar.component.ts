import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: false
})
export class NavbarComponent implements OnInit {

  constructor(private authService: AuthService,
              private toastrService: ToastrService,
  ) { }

  ngOnInit() {
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  isNotAuthenticated(): boolean {
    return this.authService.isNotAuthenticated();
  }
  logout(): void {
    this.authService.logout();
    this.toastrService.success('Sesión cerrada correctamente.', 'Éxito');
  }
}
