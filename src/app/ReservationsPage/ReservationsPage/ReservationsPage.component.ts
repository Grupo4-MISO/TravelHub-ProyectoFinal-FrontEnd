import { Component, OnInit } from '@angular/core';
import { ReservationsPageService } from '../ReservationsPage.service';
import { firstValueFrom } from 'rxjs';


interface Usuario{
  id: string;
  first_name: string;
  last_name:string;
  email: string;
  country: string;
  gender: string;
}

@Component({
  selector: 'app-ReservationsPage',
  templateUrl: './ReservationsPage.component.html',
  styleUrls: ['./ReservationsPage.component.css'],
  standalone: false
})
export class ReservationsPageComponent implements OnInit {
  usuario: Usuario | null = null;
  reservaActiva: any = null;
  reservas: any[] = [];

  constructor(
    private reservationsService: ReservationsPageService,
  ) { }

  ngOnInit(): void{
    this.cargarUsuario();
  }

  async cargarUsuario() {

    try{
        const uuid = sessionStorage.getItem('idUsuario');
        const usuario_activo = await firstValueFrom(this.reservationsService.identificarUsuario(uuid!));
        this.usuario = usuario_activo;
    } catch (error) {
        console.error('Error al cargar el usuario:', error);
    }
  
  }

  ver_reserva(reserva: any, fila: any) {}

}
