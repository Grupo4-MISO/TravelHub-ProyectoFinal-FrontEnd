import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { JwtModule } from '@auth0/angular-jwt';

import { AppRoutingModule } from './app-routing.module';
import { App } from './app';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { PrincipalPageComponent } from './PrincipalPage/PrincipalPage.component';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { ResultsPageComponent } from './ResultsPage/ResultsPage.component';
import { PropertyDetailPageComponent } from './PropertyDetailPage/PropertyDetailPage.component';

export function tokenGetter(): string | null {
  return sessionStorage.getItem('token');
}

@NgModule({
  declarations: [
    App,
    NavbarComponent,
    FooterComponent,
    SearchbarComponent,
    PrincipalPageComponent,
    ResultsPageComponent,
    PropertyDetailPageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-center',
      timeOut: 2500,
      closeButton: true,
      progressBar: true,
      preventDuplicates: true,
      newestOnTop: true,
      toastClass: 'ngx-toastr travelhub-toast',
      titleClass: 'travelhub-toast-title',
      messageClass: 'travelhub-toast-message'
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: ['127.0.0.1:5000'],
      },
    }),
    AppRoutingModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
  ],
  bootstrap: [App]
})
export class AppModule { }
