import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TarifasService, Tarifa } from '../tarifas.service';

@Component({
  selector: 'app-tarifas-page',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './TarifasPage.component.html',
  styleUrls: ['./TarifasPage.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TarifasPageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly tarifasService = inject(TarifasService);
  private readonly cdr = inject(ChangeDetectorRef);

  tarifas: Tarifa[] = [];

  ngOnInit(): void {
    this.loadTarifas();
  }

  private loadTarifas(): void {
    this.tarifasService.getTarifas().subscribe({
      next: (t) => {
        this.tarifas = t;
        this.cdr.markForCheck();
      },
      error: () => {
        this.tarifas = [];
        this.cdr.markForCheck();
      },
    });
  }

  get userRole(): string | null {
    return sessionStorage.getItem('role');
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
