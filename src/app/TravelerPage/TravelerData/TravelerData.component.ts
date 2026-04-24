import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-traveler-data',
  imports: [ReactiveFormsModule],
  templateUrl: './TravelerData.component.html',
  styleUrl: './TravelerData.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TravelerDataComponent {
  readonly group = input.required<FormGroup>();
}
