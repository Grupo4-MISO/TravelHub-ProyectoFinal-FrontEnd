import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-traveler-address',
  imports: [ReactiveFormsModule],
  templateUrl: './TravelerAddress.component.html',
  styleUrl: './TravelerAddress.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TravelerAddressComponent {
  readonly group = input.required<FormGroup>();
}
