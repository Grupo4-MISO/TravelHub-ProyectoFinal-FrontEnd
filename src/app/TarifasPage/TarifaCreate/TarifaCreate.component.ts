import { ChangeDetectionStrategy, Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TarifasService, Tarifa, Descuento } from '../tarifas.service';

export const MONEDAS_TARIFA = ['COP', 'USD', 'PEN', 'MXN', 'CLP', 'ARS'] as const;

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
  monedas = MONEDAS_TARIFA;

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
    moneda: this.monedas[0],
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
          this.descuentos = (t.descuentos_activos || []).map(descuento => ({
            ...descuento,
            vigencia_inicio: this.toDateOnly(descuento.vigencia_inicio),
            vigencia_fin: this.toDateOnly(descuento.vigencia_fin)
          }));
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error cargando tarifa', err);
          this.toastr.error($localize`:@@errorCargarTarifa:No se pudo cargar la tarifa`, $localize`:@@error:Error`);
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

  private toDateOnly(value?: string): string {
    if (!value) {
      return '';
    }

    return value.split('T')[0];
  }

  private formatStartOfDayUtc(value?: string): string | undefined {
    const dateOnly = this.toDateOnly(value);
    return dateOnly ? `${dateOnly}T00:00:00Z` : undefined;
  }

  private formatEndOfDayUtc(value?: string): string | undefined {
    const dateOnly = this.toDateOnly(value);
    return dateOnly ? `${dateOnly}T23:59:59Z` : undefined;
  }

  private validarFechasDescuento(descuento: Partial<Descuento>): boolean {
    const tarifaInicio = this.parseDate(this.tarifa.vigencia_inicio);
    const tarifaFin = this.parseDate(this.tarifa.vigencia_fin);
    const descuentoInicio = this.parseDate(descuento.vigencia_inicio);
    const descuentoFin = this.parseDate(descuento.vigencia_fin);

    if (!tarifaInicio || !tarifaFin) {
      this.toastr.error($localize`:@@primeroDefineFechas:Primero define las fechas de vigencia de la tarifa`, $localize`:@@fechasInvalidas:Fechas inválidas`);
      return false;
    }

    if (!descuentoInicio || !descuentoFin) {
      this.toastr.error($localize`:@@completarFechasDescuento:Debes completar las fechas de vigencia del descuento`, $localize`:@@fechasInvalidas:Fechas inválidas`);
      return false;
    }

    if (descuentoInicio > descuentoFin) {
      this.toastr.error($localize`:@@inicioMayorFin:La fecha de inicio del descuento no puede ser mayor que la fecha de fin`, $localize`:@@fechasInvalidas:Fechas inválidas`);
      return false;
    }

    if (descuentoInicio < tarifaInicio) {
      this.toastr.error($localize`:@@inicioDescuentoPosterior:La fecha de inicio del descuento debe ser igual o posterior a la fecha de inicio de la tarifa`, $localize`:@@fechasInvalidas:Fechas inválidas`);
      return false;
    }

    if (descuentoFin > tarifaFin) {
      this.toastr.error($localize`:@@finDescuentoAnterior:La fecha de fin del descuento debe ser igual o anterior a la fecha de fin de la tarifa`, $localize`:@@fechasInvalidas:Fechas inválidas`);
      return false;
    }

    return true;
  }

  private validarIdentificador(): boolean {
    if (!this.tarifa.identificador || !this.tarifa.identificador.trim()) {
      this.toastr.error($localize`:@@identificadorVacio:El identificador de la tarifa no puede estar vacío`, $localize`:@@validacion:Validación`);
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

      body.vigencia_inicio = this.formatStartOfDayUtc(descuento.vigencia_inicio);
      body.vigencia_fin = this.formatEndOfDayUtc(descuento.vigencia_fin);

      this.tarifasService.createDescuento(body).subscribe({
        next: () => {
          descuentosCreados++;
          if (descuentosCreados === descuentosNuevos.length) {
            this.toastr.success($localize`:@@descuentosCreados:Descuentos creados correctamente`, $localize`:@@exito:Éxito`);
            this.router.navigate(['/tarifas']);
          }
        },
        error: (err) => {
          console.error('Error creando descuento', err);
          this.toastr.error($localize`:@@errorCrearDescuento:No se pudo crear un descuento`, $localize`:@@error:Error`);
        }
      });
    }
  }

  save(): void {
    if (!this.validarIdentificador()) {
      return;
    }

    const hotelId = sessionStorage.getItem('provider_id') || '';

    const body: any = {
      nombre: this.tarifa.nombre,
      hotel_id: hotelId,
      identificador: this.tarifa.identificador?.trim(),
      descripcion: this.tarifa.descripcion,
      valor_base: Number(this.tarifa.valor_base) || 0,
      moneda: this.tarifa.moneda || 'COP',
      categoria_habitacion: this.tarifa.categoria_habitacion,
    };

    body.vigencia_inicio = this.formatStartOfDayUtc(this.tarifa.vigencia_inicio);
    body.vigencia_fin = this.formatEndOfDayUtc(this.tarifa.vigencia_fin);

    // Add descuentos array to body if provided
    body.descuentos = this.descuentos
      .filter(descuento => descuento.vigencia_inicio && descuento.vigencia_fin)
      .map(descuento => {
        const descuentoObj: any = {
          nombre: descuento.nombre,
          porcentaje: Number(descuento.porcentaje) || 0,
          activo: descuento.activo !== false,
          vigencia_inicio: this.formatStartOfDayUtc(descuento.vigencia_inicio),
          vigencia_fin: this.formatEndOfDayUtc(descuento.vigencia_fin),
        };
        return descuentoObj;
      });

    if (this.isEdit && this.tarifaId) {
      this.tarifasService.updateTarifa(this.tarifaId, body).subscribe({
        next: () => {
          this.toastr.success($localize`:@@tarifaActualizada:Tarifa actualizada correctamente`, $localize`:@@exito:Éxito`);
          this.router.navigate(['/tarifas']);
        },
        error: (err) => {
          console.error('Error actualizando tarifa', err);
          this.toastr.error($localize`:@@errorActualizarTarifa:No se pudo actualizar la tarifa`, $localize`:@@error:Error`);
        }
      });
    } else {
      this.tarifasService.createTarifa(body).subscribe({
        next: (tarifaCreada) => {
          this.toastr.success($localize`:@@tarifaCreada:Tarifa creada correctamente`, $localize`:@@exito:Éxito`);
          this.router.navigate(['/tarifas']);
        },
        error: (err) => {
          console.error('Error creando tarifa', err);
          this.toastr.error($localize`:@@errorCrearTarifa:No se pudo crear la tarifa`, $localize`:@@error:Error`);
        }
      });
    }
  }
}
