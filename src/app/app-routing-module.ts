import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogginPageComponent } from './LogginPage/LogginPage.component';
import { PrincipalPageComponent } from './PrincipalPage/PrincipalPage/PrincipalPage.component';
import { ResultsPageComponent } from './ResultsPage/ResultsPage/ResultsPage.component';
import { PropertyDetailPageComponent } from './PropertyDetailPage/PropertyDetailPage.component';

const routes: Routes = [
  { path: '', component: PrincipalPageComponent },
  { path: 'login', component: LogginPageComponent },
  { path: 'results', component: ResultsPageComponent },
  { path: 'property', component: PropertyDetailPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
