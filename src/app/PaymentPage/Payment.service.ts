import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

export type PaymentMetadata = {
	readonly habitacion_id: string;
	readonly habitacion: string;
	readonly check_in: string;
	readonly check_out: string;
};

export type CreatePaymentRequest = {
	readonly reserva_id: string;
	readonly provider_id: string;
	readonly amount: number;
	readonly currency: string;
	readonly status: 'pending';
	readonly description: string;
	readonly provider_payment_id: string | null;
	readonly url: string | null;
	readonly metadata: PaymentMetadata;
};

export type CreatePaymentResponse = {
	readonly provider_payment_id: string | null;
	readonly url: string | null;
};

@Injectable({ providedIn: 'root' })
export class PaymentService {
	private readonly http = inject(HttpClient);
	// Importamos URL del backend
	//private api_url = environment.apiUrl;
	
	// Para desarrollo local, usar la URL del inventarios
	private api_url = environment.apiUrl;
	private readonly paymentsEndpoint = `${this.api_url}/api/v1/Transactions/payments`;

	createPayment(payload: CreatePaymentRequest): Observable<CreatePaymentResponse> {
		return this.http.post<CreatePaymentResponse>(this.paymentsEndpoint, payload);
	}
}
