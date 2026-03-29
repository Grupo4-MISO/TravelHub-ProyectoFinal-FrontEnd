import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { auth } from './auth';
import { HttpClient } from '@angular/common/http';
import { user } from './user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://127.0.0.1:5000';

  constructor(private http: HttpClient) {}

  login(credentials: auth): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/v1/auth/login`, {
      email: credentials.email,
      password: credentials.password,
    });
  }

  registro(usuario: user): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/v1/auth/users`, {
      email: usuario.email,
      password: usuario.password,
      role: usuario.role,
      username: usuario.username,
    });
  }

  logout(): void {
    sessionStorage.removeItem('idUsuario');
  }

  isAuthenticated(): boolean {
    const idUsuario = sessionStorage.getItem('idUsuario');
    return idUsuario !== null && idUsuario.trim().length > 0;
  }

  isNotAuthenticated(): boolean {
    return !this.isAuthenticated();
  }

  getCurrentUser(): auth | null {
    const idUsuario = sessionStorage.getItem('idUsuario');
    // In a real application, you would fetch the user details from the backend using the idUsuario
    return null;
  }
}
