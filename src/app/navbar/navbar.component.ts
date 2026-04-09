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
  username: string | null = null;

  constructor(private authService: AuthService,
              private toastrService: ToastrService,
  ) { }

  ngOnInit() {
  }

  get userRole(): string | null {
    return sessionStorage.getItem('role');
  }


  isAuthenticated(): boolean {
    this.username = sessionStorage.getItem('userName');
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
