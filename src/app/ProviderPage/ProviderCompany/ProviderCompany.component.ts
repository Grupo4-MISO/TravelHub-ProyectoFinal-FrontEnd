import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-provider-company',
  imports: [ReactiveFormsModule],
  templateUrl: './ProviderCompany.component.html',
  styleUrl: './ProviderCompany.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProviderCompanyComponent {
  readonly group = input.required<FormGroup>();
}
