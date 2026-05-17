import { ChangeDetectorRef, Component, OnInit, AfterViewInit } from '@angular/core';
import { PropertyDetailService } from '../PropertyDetailPage/PropertyDetail.service';
import { firstValueFrom } from 'rxjs';
import { Chart } from 'chart.js/auto';

interface Hotel {
  id: string;
  nombre: string;
  direccion: string;
  pais: string;
}

@Component({
  selector: 'app-billingPage',
  templateUrl: './billingPage.component.html',
  styleUrls: ['./billingPage.component.css'],
  standalone: false
})
export class BillingPageComponent implements OnInit, AfterViewInit {
  hotel: Hotel | null = null;
  cargandoHotel: boolean = false;
  chart: Chart | null = null;

  constructor(
    private propertyDetailService: PropertyDetailService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.cargarHotel();
  }

  ngAfterViewInit() {
    this.crearGraficoIngresos();
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private async cargarHotel():Promise<void>{
    this.cargandoHotel = true;
    try {
      const uuid_hotel = sessionStorage.getItem('idUsuario');
      const hotel = await firstValueFrom(
        this.propertyDetailService.getPropertyById(uuid_hotel!,"COP")
      ) as Hotel;
    this.hotel = hotel ?? null;
    this.cargandoHotel = false;
    this.cdr.detectChanges();
  } catch (error) {
    console.error('Error al cargar el hotel:', error);
    this.cargandoHotel = false;
  }
  }

  private crearGraficoIngresos(): void {
    this.chart = new Chart('Ingresos', {
      type: 'line',
      data: {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        datasets: [{
          label: $localize`:@@billingMonthlyIncome:Ingresos del Mes`,
          data: [10, 25, 15, 30, 20, 35, 25, 40, 30, 45],
          borderColor: '#015C77',
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });

  }

}
