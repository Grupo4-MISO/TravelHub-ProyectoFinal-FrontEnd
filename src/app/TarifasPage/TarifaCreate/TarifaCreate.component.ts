import { ChangeDetectionStrategy, Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TarifasService, Tarifa, Descuento } from '../tarifas.service';

@Component({
  selector: 'app-tarifa-create',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './TarifaCreate.component.html',
  styleUrls: ['./TarifaCreate.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: []
})
export class TarifaCreateComponent implements OnInit {
  categorias = ['SENCILLA', 'DOBLE', 'TRIPLE', 'SUITE', 'DELUXE', 'FAMILIAR'];

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly tarifasService = inject(TarifasService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly toastr = inject(ToastrService);

  tarifaId?: string;
  isEdit = false;

  tarifa: Partial<Tarifa> = {
    nombre: '',
    identificador: '',
    descripcion: '',
    valor_base: 0,
    moneda: 'COP',
    categoria_habitacion: this.categorias[0],
    vigencia_inicio: '',
    vigencia_fin: ''
  };

  descuentos: Partial<Descuento>[] = [];
  descuentoForm: Partial<Descuento> = {
    nombre: '',
    porcentaje: 0,
    activo: true,
    vigencia_inicio: '',
    vigencia_fin: ''
  };
  mostrarFormDescuento = false;

  constructor() {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.tarifaId = id;
      this.tarifasService.getTarifa(id).subscribe({
        next: (t) => {
          this.tarifa = {
            nombre: t.nombre,
            identificador: t.identificador,
            descripcion: t.descripcion,
            valor_base: t.valor_base,
            moneda: t.moneda,
            categoria_habitacion: t.categoria_habitacion,
            vigencia_inicio: t.vigencia_inicio ? t.vigencia_inicio.split('T')[0] : '',
            vigencia_fin: t.vigencia_fin ? t.vigencia_fin.split('T')[0] : ''
          };
          this.descuentos = t.descuentos_activos || [];
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error cargando tarifa', err);
          this.toastr.error('No se pudo cargar la tarifa', 'Error');
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/tarifas']);
  }

  toggleFormDescuento(): void {
    this.mostrarFormDescuento = !this.mostrarFormDescuento;
  }

  private parseDate(value?: string): Date | null {
    if (!value) {
      return null;
    }

    const normalized = value.includes('T') ? value : `${value}T00:00:00Z`;
    const date = new Date(normalized);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  private validarFechasDescuento(descuento: Partial<Descuento>): boolean {
    const tarifaInicio = this.parseDate(this.tarifa.vigencia_inicio);
    const tarifaFin = this.parseDate(this.tarifa.vigencia_fin);
    const descuentoInicio = this.parseDate(descuento.vigencia_inicio);
    const descuentoFin = this.parseDate(descuento.vigencia_fin);

    if (!tarifaInicio || !tarifaFin) {
      this.toastr.error('Primero define las fechas de vigencia de la tarifa', 'Fechas inválidas');
      return false;
    }

    if (!descuentoInicio || !descuentoFin) {
      this.toastr.error('Debes completar las fechas de vigencia del descuento', 'Fechas inválidas');
      return false;
    }

    if (descuentoInicio > descuentoFin) {
      this.toastr.error('La fecha de inicio del descuento no puede ser mayor que la fecha de fin', 'Fechas inválidas');
      return false;
    }

    if (descuentoInicio < tarifaInicio) {
      this.toastr.error('La fecha de inicio del descuento debe ser igual o posterior a la fecha de inicio de la tarifa', 'Fechas inválidas');
      return false;
    }

    if (descuentoFin > tarifaFin) {
      this.toastr.error('La fecha de fin del descuento debe ser igual o anterior a la fecha de fin de la tarifa', 'Fechas inválidas');
      return false;
    }

    return true;
  }

  agregarDescuento(): void {
    if (this.descuentoForm.nombre && this.descuentoForm.porcentaje) {
      if (!this.validarFechasDescuento(this.descuentoForm)) {
        return;
      }

      const nuevoDescuento = { ...this.descuentoForm };
      this.descuentos.push(nuevoDescuento);
      this.descuentoForm = {
        nombre: '',
        porcentaje: 0,
        activo: true,
        vigencia_inicio: '',
        vigencia_fin: ''
      };
      this.cdr.markForCheck();
    }
  }

  eliminarDescuento(index: number): void {
    this.descuentos.splice(index, 1);
    this.cdr.markForCheck();
  }

  private crearDescuentos(tarifaId: string): void {
    const descuentosNuevos = this.descuentos.filter((descuento) => !descuento.id);

    if (descuentosNuevos.length === 0) {
      this.router.navigate(['/tarifas']);
      return;
    }

    let descuentosCreados = 0;
    for (const descuento of descuentosNuevos) {
      if (!this.validarFechasDescuento(descuento)) {
        return;
      }

      const body: any = {
        nombre: descuento.nombre,
        tarifa_id: tarifaId,
        porcentaje: Number(descuento.porcentaje) || 0,
        activo: descuento.activo !== false,
      };

      if (descuento.vigencia_inicio) {
        body.vigencia_inicio = `${descuento.vigencia_inicio}T00:00:00Z`;
      }
      if (descuento.vigencia_fin) {
        body.vigencia_fin = `${descuento.vigencia_fin}T23:59:59Z`;
      }

      this.tarifasService.createDescuento(body).subscribe({
        next: () => {
          descuentosCreados++;
          if (descuentosCreados === descuentosNuevos.length) {
            this.toastr.success('Descuentos creados correctamente', 'Éxito');
            this.router.navigate(['/tarifas']);
          }
        },
        error: (err) => {
          console.error('Error creando descuento', err);
          this.toastr.error('No se pudo crear un descuento', 'Error');
        }
      });
    }
  }

  save(): void {
    const hotelId = sessionStorage.getItem('provider_id') || '';

    const body: any = {
      nombre: this.tarifa.nombre,
      hotel_id: hotelId,
      identificador: this.tarifa.identificador,
      descripcion: this.tarifa.descripcion,
      valor_base: Number(this.tarifa.valor_base) || 0,
      moneda: this.tarifa.moneda || 'COP',
      categoria_habitacion: this.tarifa.categoria_habitacion,
    };

    if (this.tarifa.vigencia_inicio) {
      body.vigencia_inicio = `${this.tarifa.vigencia_inicio}T00:00:00Z`;
    }
    if (this.tarifa.vigencia_fin) {
      body.vigencia_fin = `${this.tarifa.vigencia_fin}T23:59:59Z`;
    }

    if (this.isEdit && this.tarifaId) {
      this.tarifasService.updateTarifa(this.tarifaId, body).subscribe({
        next: () => {
          this.toastr.success('Tarifa actualizada correctamente', 'Éxito');
          if (this.descuentos.length > 0) {
            this.crearDescuentos(this.tarifaId!);
          } else {
            this.router.navigate(['/tarifas']);
          }
        },
        error: (err) => {
          console.error('Error actualizando tarifa', err);
          this.toastr.error('No se pudo actualizar la tarifa', 'Error');
        }
      });
    } else {
      this.tarifasService.createTarifa(body).subscribe({
        next: (tarifaCreada) => {
          this.toastr.success('Tarifa creada correctamente', 'Éxito');
          if (this.descuentos.length > 0) {
            this.crearDescuentos(tarifaCreada.id);
          } else {
            this.router.navigate(['/tarifas']);
          }
        },
        error: (err) => {
          console.error('Error creando tarifa', err);
          this.toastr.error('No se pudo crear la tarifa', 'Error');
        }
      });
    }
  }
}
