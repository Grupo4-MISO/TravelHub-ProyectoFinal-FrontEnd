import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipalPageComponent } from './PrincipalPage/PrincipalPage/PrincipalPage.component';
import { ResultsPageComponent } from './ResultsPage/ResultsPage/ResultsPage.component';
import { PropertyDetailPageComponent } from './PropertyDetailPage/PropertyDetailPage.component';
import { RoomsPageComponent } from './RoomsPage/RoomsPage.component';
import { BookingHotelPageComponent } from './BookingHotelPage/BookingHotelPage.component';

const routes: Routes = [
  { path: '', component: PrincipalPageComponent },
  { path: 'login', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule) },
  { path: 'results', component: ResultsPageComponent },
  { path: 'property', component: PropertyDetailPageComponent },
  { path: 'rooms', component: RoomsPageComponent },
  { path: 'booking', component: BookingHotelPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
