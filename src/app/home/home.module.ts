import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { MapComponentComponent } from 'src/app/components/map-component/map-component.component';
import { BoxPlotComponent } from '../components/box-plot/box-plot.component';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SearchBoxComponent } from "../components/search-box/search-box.component";
import { ScoreTableComponent } from '../components/score-table/score-table.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    MapComponentComponent,
    BoxPlotComponent,
    ScoreTableComponent,
    NgxDatatableModule,
    SearchBoxComponent
],
  declarations: [HomePage]
})
export class HomePageModule { }
