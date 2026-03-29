import { ResultsPageComponent } from './ResultsPage/ResultsPage.component';
import { SearchBarModule } from '../searchbar/searchbar.module';
import { FooterModule } from '../footer/footer.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    SearchBarModule,
    FooterModule
  ],
  exports: [ResultsPageComponent],
  declarations: [ResultsPageComponent]
})
export class ResultsPageModule { }
