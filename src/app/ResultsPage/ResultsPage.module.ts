import { ResultsPageComponent } from './ResultsPage/ResultsPage.component';
import { SearchBarModule } from '../searchbar/searchbar.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    SearchBarModule
  ],
  exports: [ResultsPageComponent],
  declarations: [ResultsPageComponent]
})
export class ResultsPageModule { }
