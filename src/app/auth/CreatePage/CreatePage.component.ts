import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { ProviderFormComponent } from '../../ProviderPage/ProviderForm/ProviderForm.component';
import { TravelerFormComponent } from '../../TravelerPage/TravelerForm/TravelerForm.component';

type AccountView = 'traveler' | 'provider';

@Component({
  selector: 'app-create-page',
  imports: [TravelerFormComponent, ProviderFormComponent],
  templateUrl: './CreatePage.component.html',
  styleUrl: './CreatePage.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreatePageComponent {
  readonly selectedView = signal<AccountView>('traveler');
  readonly isTravelerView = computed(() => this.selectedView() === 'traveler');

  showTraveler(): void {
    this.selectedView.set('traveler');
  }

  showProvider(): void {
    this.selectedView.set('provider');
  }
}
