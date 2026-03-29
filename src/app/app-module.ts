import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { SearchBarModule } from './searchbar/searchbar.module';
import { NavbarComponent } from './navbar/navbar.component';
import { LogginPageComponent } from './LogginPage/LogginPage.component';
import { FooterComponent } from './footer/footer.component';
import { PropertyDetailPageComponent } from './PropertyDetailPage/PropertyDetailPage.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PrincipalPageModule } from './PrincipalPage/PrincipalPage.module';
import { ResultsPageModule } from './ResultsPage/ResultsPage.module';

@NgModule({
  declarations: [
    App,
    NavbarComponent,
    FooterComponent,
    LogginPageComponent,
    PropertyDetailPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    SearchBarModule,
    PrincipalPageModule,
    ResultsPageModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
  ],
  bootstrap: [App]
})
export class AppModule { }
