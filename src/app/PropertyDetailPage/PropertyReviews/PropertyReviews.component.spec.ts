import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { PropertyReviewComment } from './property-review';
import { PropertyReviewsComponent } from './PropertyReviews.component';
import { PropertyReviewsService } from './PropertyReviews.service';

describe('PropertyReviewsComponent', () => {
  let component: PropertyReviewsComponent;
  let fixture: ComponentFixture<PropertyReviewsComponent>;
  let reviewsServiceSpy: {
    getReviewsByHospedajeId: ReturnType<typeof vi.fn>;
    getReviewsUrl: ReturnType<typeof vi.fn>;
  };

  const commentsMock: PropertyReviewComment[] = [
    {
      id: 'c1',
      hospedajeId: 'h1',
      userName: 'Ana',
      userId: 'u1',
      comment: 'Excelente lugar',
      rating: 5
    }
  ];

  const waitForAsyncPipe = async (): Promise<void> => {
    await Promise.resolve();
  };

  beforeEach(async () => {
    reviewsServiceSpy = {
      getReviewsByHospedajeId: vi.fn(),
      getReviewsUrl: vi.fn((id: string) => `https://api.test/reviews/${id}`)
    };

    await TestBed.configureTestingModule({
      imports: [PropertyReviewsComponent],
      providers: [{ provide: PropertyReviewsService, useValue: reviewsServiceSpy as Partial<PropertyReviewsService> }]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyReviewsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('shows validation error when hospedajeId is missing', async () => {
    fixture.detectChanges();
    await waitForAsyncPipe();
    fixture.detectChanges();

    const rootText = fixture.nativeElement.textContent as string;
    expect(rootText).toContain('No se puede cargar opiniones porque no llegó el id del hospedaje.');
    expect(reviewsServiceSpy.getReviewsByHospedajeId).not.toHaveBeenCalled();
  });

  it('loads and renders reviews when service returns comments', async () => {
    reviewsServiceSpy.getReviewsByHospedajeId.mockReturnValue(of(commentsMock));

    component.hospedajeId = 'h1';
    fixture.detectChanges();
    await waitForAsyncPipe();
    fixture.detectChanges();

    expect(reviewsServiceSpy.getReviewsByHospedajeId).toHaveBeenCalledWith('h1');
    const rootText = fixture.nativeElement.textContent as string;
    expect(rootText).toContain('Ana');
    expect(rootText).toContain('Excelente lugar');
  });

  it('maps 404 errors into a friendly message', async () => {
    reviewsServiceSpy.getReviewsByHospedajeId.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 404, statusText: 'Not Found' }))
    );

    component.hospedajeId = 'h1';
    fixture.detectChanges();
    await waitForAsyncPipe();
    fixture.detectChanges();

    const rootText = fixture.nativeElement.textContent as string;
    expect(rootText).toContain('no encontro resultados para este hospedaje');
  });

  it('builds star arrays from rating', () => {
    expect(component.getStarArray(3.7).length).toBe(3);
    expect(component.getEmptyStarArray(3.7).length).toBe(2);
  });
});
