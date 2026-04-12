import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, distinctUntilChanged, map, shareReplay, startWith, switchMap, timeout } from 'rxjs/operators';
import { PropertyReviewComment } from './property-review';
import { PropertyReviewsService } from './PropertyReviews.service';

type ReviewsState = {
  loading: boolean;
  comments: PropertyReviewComment[];
  error: string;
  errorDetail: string;
};

@Component({
  selector: 'app-property-reviews',
  templateUrl: './PropertyReviews.component.html',
  styleUrls: ['./PropertyReviews.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PropertyReviewsComponent {
  private readonly hospedajeIdSubject = new BehaviorSubject<string>('');

  @Input()
  set hospedajeId(value: string) {
    this.hospedajeIdSubject.next((value || '').trim());
  }

  readonly vm$: Observable<ReviewsState> = this.hospedajeIdSubject.asObservable().pipe(
    distinctUntilChanged(),
    switchMap((hospedajeId) => {
      if (!hospedajeId) {
        return of<ReviewsState>({
          loading: false,
          comments: [],
          error: 'No se puede cargar opiniones porque no llegó el id del hospedaje.',
          errorDetail: 'Verifica que la URL incluya el query param id.'
        });
      }

      return this.reviewsService.getReviewsByHospedajeId(hospedajeId).pipe(
        timeout(12000),
        map((comments) => ({
          loading: false,
          comments,
          error: '',
          errorDetail: ''
        })),
        startWith({
          loading: true,
          comments: [],
          error: '',
          errorDetail: ''
        } as ReviewsState),
        catchError((err: unknown) => {
          const httpError = err as HttpErrorResponse;

          if ((err as { name?: string }).name === 'TimeoutError') {
            return of<ReviewsState>({
              loading: false,
              comments: [],
              error: 'El servicio de opiniones tardo demasiado en responder.',
              errorDetail: `Endpoint: ${this.reviewsService.getReviewsUrl(hospedajeId)}`
            });
          }

          if (httpError.status === 0) {
            return of<ReviewsState>({
              loading: false,
              comments: [],
              error: 'No se pudo conectar con el servicio de opiniones.',
              errorDetail: 'Posible causa: backend caido, CORS o URL inaccesible.'
            });
          }

          if (httpError.status === 404) {
            return of<ReviewsState>({
              loading: false,
              comments: [],
              error: 'El servicio de opiniones no encontro resultados para este hospedaje.',
              errorDetail: `Endpoint: ${this.reviewsService.getReviewsUrl(hospedajeId)}`
            });
          }

          if (httpError.status >= 500) {
            return of<ReviewsState>({
              loading: false,
              comments: [],
              error: 'El servicio de opiniones fallo en el servidor.',
              errorDetail: `HTTP ${httpError.status}. Intenta de nuevo en unos segundos.`
            });
          }

          if (httpError.status >= 400) {
            return of<ReviewsState>({
              loading: false,
              comments: [],
              error: 'La solicitud de opiniones fue rechazada.',
              errorDetail: `HTTP ${httpError.status}. ${httpError.error?.message || ''}`.trim()
            });
          }

          return of<ReviewsState>({
            loading: false,
            comments: [],
            error: 'No fue posible cargar las opiniones.',
            errorDetail: httpError.message || 'Error no identificado.'
          });
        })
      );
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  constructor(private reviewsService: PropertyReviewsService) { }

  getStarArray(rating: number): number[] {
    return Array(Math.floor(rating));
  }

  getEmptyStarArray(rating: number): number[] {
    return Array(5 - Math.floor(rating));
  }
}
