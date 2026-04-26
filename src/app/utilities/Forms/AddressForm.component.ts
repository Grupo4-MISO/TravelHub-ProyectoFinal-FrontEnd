import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-address-form',
  imports: [ReactiveFormsModule],
  templateUrl: './AddressForm.component.html',
  styleUrl: './AddressForm.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressFormComponent {
  readonly group = input.required<FormGroup>();
  readonly states = input<readonly string[]>([]);
  readonly cities = input<readonly string[]>([]);
  readonly isLoadingStates = input(false);
  readonly isLoadingCities = input(false);
  readonly statesError = input('');
  readonly citiesError = input('');
}