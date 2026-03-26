import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { NavbarComponent } from './navbar/navbar.component';
import { LogginPageComponent } from './LogginPage/LogginPage.component';
import { FooterComponent } from './footer/footer.component';
import { PrincipalPageComponent } from './PrincipalPage/PrincipalPage.component';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { ResultsPageComponent } from './ResultsPage/ResultsPage.component';
import { PropertyDetailPageComponent } from './PropertyDetailPage/PropertyDetailPage.component';

@NgModule({
  declarations: [
    App,
    NavbarComponent,
    FooterComponent,
    SearchbarComponent,
    PrincipalPageComponent,
    LogginPageComponent,
    ResultsPageComponent,
    PropertyDetailPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
  ],
  bootstrap: [App]
})
export class AppModule { }
