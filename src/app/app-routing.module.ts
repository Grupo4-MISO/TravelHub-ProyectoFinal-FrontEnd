import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipalPageComponent } from './PrincipalPage/PrincipalPage/PrincipalPage.component';
import { ResultsPageComponent } from './ResultsPage/ResultsPage/ResultsPage.component';
import { PropertyDetailComponent } from './PropertyDetailPage/PropertyDetail/PropertyDetail.component';
import { BookingHotelPageComponent } from './BookingHotelPage/BookingHotelPage/BookingHotelPage.component';

const routes: Routes = [
  { path: '', component: PrincipalPageComponent },
  { path: 'login', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule) },
  { path: 'results', component: ResultsPageComponent },
  { path: 'property', component: PropertyDetailComponent },
  { path: 'booking', component: BookingHotelPageComponent },
  {
    path: 'payment',
    loadComponent: () => import('./PaymentPage/PaymentPage.component').then((c) => c.PaymentPageComponent)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
