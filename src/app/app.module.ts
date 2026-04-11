import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { JwtModule } from '@auth0/angular-jwt';

import { App } from './app';
import { NavbarModule } from './navbar/navbar.module';
import { SearchBarModule } from './searchbar/searchbar.module';
import { PropertyDetailPageModule } from './PropertyDetailPage/PropertyDetailPage.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PrincipalPageModule } from './PrincipalPage/PrincipalPage.module';
import { ResultsPageModule } from './ResultsPage/ResultsPage.module';
import { FooterModule } from './footer/footer.module';
import { provideToastr } from 'ngx-toastr';
import { PropertyDetailPageComponent } from './PropertyDetailPage/PropertyDetailPage/PropertyDetailPage.component';

export function tokenGetter(): string | null {
  return sessionStorage.getItem('token');
}

@NgModule({
  declarations: [		
    App,
    
   ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    SearchBarModule,
    PrincipalPageModule,
    ResultsPageModule,
    PropertyDetailPageModule,
    NavbarModule,
    FooterModule,
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
    provideToastr()
  ],
  bootstrap: [App]
})
export class AppModule { }
