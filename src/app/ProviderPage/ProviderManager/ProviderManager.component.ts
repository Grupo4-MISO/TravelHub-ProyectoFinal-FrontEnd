import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-provider-manager',
  imports: [ReactiveFormsModule],
  templateUrl: './ProviderManager.component.html',
  styleUrl: './ProviderManager.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProviderManagerComponent {
  readonly group = input.required<FormGroup>();
}
