import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { CountryList } from '../../navbar/countrylist';
import { NavbarService } from '../../navbar/navbar.service';
import { CountryState, ProviderLocationService, StateCity } from '../../ProviderPage/provider-location.service';
import { AddressFormComponent } from '../../utilities/Forms/AddressForm.component';
import { TravelerDataComponent } from '../TravelerData/TravelerData.component';
import { CreateTravelerPayload } from '../traveler.models';
import { TravelerService } from '../traveler.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-traveler-form',
  imports: [ReactiveFormsModule, TravelerDataComponent, AddressFormComponent],
  templateUrl: './TravelerForm.component.html',
  styleUrl: './TravelerForm.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TravelerFormComponent {
  private readonly defaultCountryName = 'Colombia';
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly travelerService = inject(TravelerService);
  private readonly providerLocationService = inject(ProviderLocationService);
  private readonly navbarService = inject(NavbarService);

  currentCountry: CountryList | null = null;
  currentCountryCode = 'CO';

  readonly isSubmitting = signal(false);
  readonly isLoadingStates = signal(false);
  readonly isLoadingCities = signal(false);
  readonly statesError = signal('');
  readonly citiesError = signal('');
  readonly submitError = signal('');
  readonly submitSuccess = signal('');
  readonly states = signal<readonly CountryState[]>([]);
  readonly cities = signal<readonly StateCity[]>([]);

  readonly form = this.fb.nonNullable.group({
    traveler: this.fb.nonNullable.group({
      documentNumber: ['', [Validators.required, Validators.maxLength(30)]],
      first_name: ['', [Validators.required, Validators.maxLength(60)]],
      last_name: ['', [Validators.required, Validators.maxLength(60)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(80)]],
      travelerStatus: ['Pending', [Validators.required, Validators.maxLength(20)]],
      gender: ['Female', [Validators.required, Validators.maxLength(20)]],
      photo: ['']
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

  readonly stateOptions = computed(() => this.states().map((state) => state.name));
  readonly cityOptions = computed(() => this.cities().map((city) => city.name));

  constructor(private toastrService: ToastrService) {
    this.navbarService.country$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((country: CountryList | null) => {
        if (country) {
          this.currentCountry = country;
          this.currentCountryCode = country.code.trim().toUpperCase();
          this.applyCountrySelection(country.name, this.currentCountryCode);
        }
      });

    this.addressGroup.controls.state.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((stateName) => {
        this.handleStateChange(stateName);
      });

    const initialCountry = this.navbarService.getCurrentCountry();

    if (initialCountry) {
      this.currentCountry = initialCountry;
      this.currentCountryCode = initialCountry.code.trim().toUpperCase();
      this.applyCountrySelection(initialCountry.name, this.currentCountryCode);
      return;
    }

    this.applyCountrySelection(this.defaultCountryName, this.currentCountryCode);
  }

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
        travelerStatus: traveler.travelerStatus.trim() || 'Pending',
        gender: traveler.gender.trim(),
        photo: traveler.photo.trim()
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
    console.log('Payload:', JSON.stringify(payload, null, 2));

    this.travelerService
      .createTraveler(payload)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.submitSuccess.set('Traveler creado correctamente.');
          this.form.reset();
          this.form.controls.traveler.controls.travelerStatus.patchValue('Pending');

          const countryName = this.currentCountry?.name ?? this.defaultCountryName;
          const countryCode = this.currentCountry?.code?.trim().toUpperCase() ?? this.currentCountryCode;

          this.currentCountryCode = countryCode;
          this.applyCountrySelection(countryName, countryCode);
          this.toastrService.success('Cuenta creada correctamente.', 'Bienvenido '+ payload.traveler.first_name);
          this.router.navigate(['/login']);
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

  private handleStateChange(stateName: string): void {
    const normalizedStateName = stateName.trim();

    if (!normalizedStateName) {
      this.cities.set([]);
      this.citiesError.set('');
      this.addressGroup.controls.city.patchValue('', { emitEvent: false });
      return;
    }

    const selectedState = this.states().find((state) => state.name === normalizedStateName);

    if (!selectedState) {
      this.cities.set([]);
      this.citiesError.set('No fue posible resolver el estado seleccionado.');
      this.addressGroup.controls.city.patchValue('', { emitEvent: false });
      return;
    }

    this.loadCitiesByState(this.currentCountryCode, selectedState.iso2);
  }

  private applyCountrySelection(countryName: string, countryCode: string): void {
    this.form.controls.address.patchValue(
      {
        country: countryName,
        countryCode,
        state: '',
        city: ''
      },
      { emitEvent: false }
    );

    this.loadStatesByCountry(countryCode);
  }

  private loadStatesByCountry(countryCode: string): void {
    this.isLoadingStates.set(true);
    this.statesError.set('');
    this.states.set([]);
    this.cities.set([]);
    this.citiesError.set('');

    this.providerLocationService
      .getStatesByCountry(countryCode)
      .pipe(
        catchError((error) => {
          console.error('Error al consultar estados por pais.', error);
          this.statesError.set('No se pudieron cargar los estados para el pais seleccionado.');
          return of([] as CountryState[]);
        }),
        finalize(() => this.isLoadingStates.set(false))
      )
      .subscribe((states) => {
        this.states.set(states);

        if (states.length === 0) {
          this.addressGroup.controls.state.patchValue('', { emitEvent: false });
          this.addressGroup.controls.city.patchValue('', { emitEvent: false });
          return;
        }

        this.addressGroup.controls.state.patchValue(states[0].name);
      });
  }

  private loadCitiesByState(countryCode: string, stateCode: string): void {
    this.isLoadingCities.set(true);
    this.citiesError.set('');
    this.cities.set([]);

    this.providerLocationService
      .getCitiesByState(countryCode, stateCode)
      .pipe(
        catchError((error) => {
          console.error('Error al consultar ciudades por estado.', error);
          this.citiesError.set('No se pudieron cargar las ciudades del estado seleccionado.');
          return of([] as StateCity[]);
        }),
        finalize(() => this.isLoadingCities.set(false))
      )
      .subscribe((cities) => {
        this.cities.set(cities);

        if (cities.length === 0) {
          this.addressGroup.controls.city.patchValue('', { emitEvent: false });
          return;
        }

        this.addressGroup.controls.city.patchValue(cities[0].name, { emitEvent: false });
      });
  }
}
