import { ChangeDetectorRef, Component, OnInit, AfterViewInit } from '@angular/core';
import { PropertyDetailService } from '../PropertyDetailPage/PropertyDetail.service';
import { BillingPageService } from './billingPage.service';
import { BookingHotelPageService } from '../BookingHotelPage/BookingHotelPage.service';
import { firstValueFrom } from 'rxjs';
import { Chart } from 'chart.js/auto';
import { TmplAstHostElement } from '@angular/compiler';


interface Hotel {
  id: string;
  nombre: string;
  direccion: string;
  pais: string;
}

interface Payment{
  amount: number;
  created_at: string;
  metadata: Metadata;
}

interface Habitacion{
  habitacion_id: string;
  descripcion: string;
  reservas: number;
  ingresos: number;
  participacion: number;
}

interface Metadata{
  habitacion_id: string;
}

@Component({
  selector: 'app-billingPage',
  templateUrl: './billingPage.component.html',
  styleUrls: ['./billingPage.component.css'],
  standalone: false
})
export class BillingPageComponent implements OnInit, AfterViewInit {
  hotel: Hotel | null = null;
  habitaciones: Habitacion[] = [];
  cargandoHotel: boolean = false;
  chart: Chart | null = null;
  mesActivo: number = 5;
  anoActivo: number = 2026;
  ingresoMes: number = 0.0;
  ingresosDiarios: number[] = Array(31).fill(0);

  get hotelTitle(): string {
    return this.cargandoHotel
      ? $localize`:@@cargandoHotel:Cargando hotel...`
      : (this.hotel?.nombre || $localize`:@@hotelNoDisponible:Hotel no disponible`);
  }

  get hotelAddress(): string {
    return this.cargandoHotel
      ? $localize`:@@cargandoDireccion:Cargando dirección...`
      : (this.hotel?.direccion || $localize`:@@direccionNoDisponible:Dirección no disponible`);
  }

  get hotelCountry(): string {
    return this.cargandoHotel
      ? $localize`:@@cargandoPais:Cargando país...`
      : (this.hotel?.pais || $localize`:@@paisNoDisponible:País no disponible`);
  }

  constructor(
    private propertyDetailService: PropertyDetailService,
    private billingPageService: BillingPageService,
    private bookingHotelPageService: BookingHotelPageService,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    await this.cargarHotel();
    await this.actualizarReporte();
  }

  ngAfterViewInit() {
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
    this.habitaciones = (await firstValueFrom(
      this.bookingHotelPageService.listarHabitaciones(this.hotel.id)
    ) as Habitacion[]).map(h => ({
      ...h,
      reservas: 0,
      ingresos: 0,
      participacion: 0
    }));
    this.cdr.detectChanges();
  } catch (error) {
    console.error('Error al cargar el hotel:', error);
    this.cargandoHotel = false;
  }
  }

  private updateGraficoIngresos(): void {
    if(this.chart){
      this.chart.destroy();
    }
    this.chart = new Chart('Ingresos', {
      type: 'line',
      data: {
        labels: this.getDaysArray(this.anoActivo, this.mesActivo),
        datasets: [{
          label: $localize`Facturación diaria por reservas`,
          data: this.ingresosDiarios,
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

  private getDaysArray(year: number, month: number): number[] {
    const days = this.getDaysInMonth(year, month);
    return Array.from({ length: days }, (_, i) => i + 1);
  }

  private getDaysInMonth(year: number, month: number): number {
    return new Date(year, month, 0).getDate();
  }

  onDateChange(): void {
    this.mesActivo = Number((document.getElementById('billingMonth') as HTMLSelectElement).value);
    this.anoActivo = Number((document.getElementById('billingYear') as HTMLSelectElement).value);
    this.actualizarReporte();
  }

  strMonth(month: number): string {
    const months = [$localize`Enero`, $localize`Febrero`, $localize`Marzo`, $localize`Abril`, $localize`Mayo`, $localize`Junio`, 
      $localize`Julio`, $localize`Agosto`, $localize`Septiembre`, $localize`Octubre`, $localize`Noviembre`, $localize`Diciembre`];
    return months[month - 1] || '';
  }

  private parseServerTimestamp(ts: string): Date {
    const cleaned = ts.replace(/\.(\d{3})\d+/, '.$1'); // truncar microsegundos a ms
    return /[Zz]|[+\-]\d{2}:\d{2}$/.test(cleaned) ? new Date(cleaned) : new Date(cleaned + 'Z');
}

  private async actualizarReporte(): Promise<void> {
    const idHotel = this.hotel?.id;
    this.ingresoMes = 0.0;
    this.ingresosDiarios = Array(31).fill(0);
    
    const pagos = await firstValueFrom(
      this.billingPageService.darPagosHotel(idHotel!, this.mesActivo, this.anoActivo)
    ) as Payment[];

    for(const habitacion of this.habitaciones){
      habitacion.reservas = 0;
      habitacion.ingresos = 0;
      habitacion.participacion = 0;
    }

    for (const pago of pagos) {
      if(pago.metadata.habitacion_id === "historico-mock"){
        pago.metadata.habitacion_id = this.RandomRoom().habitacion_id;
      }
      this.ingresoMes += pago.amount;
      const d = this.parseServerTimestamp(pago.created_at);
      const day = d.getDate();
      if (day >= 1 && day <= 31) {
        this.ingresosDiarios[day - 1] += pago.amount;
      }
      for(const habitacion of this.habitaciones){
        if(habitacion.habitacion_id === pago.metadata.habitacion_id){
          habitacion.reservas++;
          habitacion.ingresos += pago.amount;
        }
      }
    }

    for (const habitacion of this.habitaciones){
      habitacion.participacion = this.ingresoMes > 0 ? (habitacion.ingresos / this.ingresoMes) * 100 : 0;
    }

    this.cdr.detectChanges();
    this.updateGraficoIngresos();

  }

  private RandomRoom(): Habitacion{
    // Proporciona una habitación aleatoria para los pagos mock de los periodos antiguos
    return this.habitaciones[Math.floor(Math.random() * this.habitaciones.length)];
  }

}
