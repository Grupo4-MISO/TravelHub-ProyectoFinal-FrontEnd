import { SearchbarComponent } from './searchbar/searchbar.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    SearchbarComponent
  ],
  declarations: [
    SearchbarComponent
  ]
})

export class SearchBarModule { }
