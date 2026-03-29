import { PrincipalPageComponent } from './PrincipalPage/PrincipalPage.component';
import { SearchBarModule } from '../searchbar/searchbar.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SearchBarModule
  ],
  exports: [
    PrincipalPageComponent
  ],
  declarations: [
    PrincipalPageComponent
  ]
})

export class PrincipalPageModule { }
