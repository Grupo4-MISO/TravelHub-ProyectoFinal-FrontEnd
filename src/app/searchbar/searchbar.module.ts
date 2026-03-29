import { SearchBarComponent } from './searchbar/searchbar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  exports: [
    SearchBarComponent
  ],
  declarations: [
    SearchBarComponent
  ]
})

export class SearchBarModule { }
