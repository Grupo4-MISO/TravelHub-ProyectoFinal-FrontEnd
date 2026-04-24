import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { TravelerAddressComponent } from '../TravelerAddress/TravelerAddress.component';
import { TravelerDataComponent } from '../TravelerData/TravelerData.component';
import { CreateTravelerPayload } from '../traveler.models';
import { TravelerService } from '../traveler.service';

@Component({
  selector: 'app-traveler-form',
  imports: [ReactiveFormsModule, TravelerDataComponent, TravelerAddressComponent],
  templateUrl: './TravelerForm.component.html',
  styleUrl: './TravelerForm.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TravelerFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly travelerService = inject(TravelerService);

  readonly isSubmitting = signal(false);
  readonly submitError = signal('');
  readonly submitSuccess = signal('');

  readonly form = this.fb.nonNullable.group({
    traveler: this.fb.nonNullable.group({
      documentNumber: ['', [Validators.required, Validators.maxLength(30)]],
      first_name: ['', [Validators.required, Validators.maxLength(60)]],
      last_name: ['', [Validators.required, Validators.maxLength(60)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(80)]],
      travelerStatus: ['Pending', [Validators.required, Validators.maxLength(20)]]
    }),
    address: this.fb.nonNullable.group({
      line1: ['', [Validators.required, Validators.maxLength(120)]],
      line2: ['', [Validators.maxLength(120)]],
      city: ['', [Validators.required, Validators.maxLength(80)]],
      state: ['', [Validators.required, Validators.maxLength(80)]],
      country: ['', [Validators.required, Validators.maxLength(80)]],
      countryCode: ['', [Validators.required, Validators.maxLength(6)]],
      postal_code: ['', [Validators.required, Validators.maxLength(20)]]
    })
  });

  readonly isInvalid = computed(() => this.form.invalid);

  get travelerGroup() {
    return this.form.controls.traveler;
  }

  get addressGroup() {
    return this.form.controls.address;
  }

  onSubmit(): void {
    this.submitError.set('');
    this.submitSuccess.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.submitError.set('Completa correctamente todos los campos obligatorios.');
      return;
    }

    const traveler = this.form.controls.traveler.getRawValue();
    const address = this.form.controls.address.getRawValue();

    const payload: CreateTravelerPayload = {
      traveler: {
        documentNumber: traveler.documentNumber.trim(),
        first_name: traveler.first_name.trim(),
        last_name: traveler.last_name.trim(),
        email: traveler.email.trim().toLowerCase(),
        phone: traveler.phone.trim(),
        password: traveler.password,
        travelerStatus: traveler.travelerStatus.trim() || 'Pending'
      },
      address: {
        line1: address.line1.trim(),
        line2: address.line2.trim(),
        city: address.city.trim(),
        state: address.state.trim(),
        country: address.country.trim(),
        countryCode: address.countryCode.trim().toUpperCase(),
        postal_code: address.postal_code.trim()
      }
    };

    this.isSubmitting.set(true);

    this.travelerService
      .createTraveler(payload)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.submitSuccess.set('Traveler creado correctamente.');
          this.form.reset();
          this.form.controls.traveler.controls.travelerStatus.patchValue('Pending');
        },
        error: (error) => {
          const backendMessage = error?.error?.message;
          const parsedMessage = Array.isArray(backendMessage)
            ? backendMessage.join(' | ')
            : typeof backendMessage === 'string'
              ? backendMessage
              : 'No fue posible crear el traveler. Intenta nuevamente.';

          this.submitError.set(parsedMessage);
        }
      });
  }
}
