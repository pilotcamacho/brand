import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabsPageRoutingModule } from './tabs-routing.module';
import { MapComponentComponent } from 'src/app/components/map-component/map-component.component';

import { TabsPage } from './tabs.page';
import { BarChartComponent } from '../components/bar-chart/bar-chart.component';
import { QChartComponent } from '../components/q-chart/q-chart.component';
import { BoxPlotComponent } from '../components/box-plot/box-plot.component';
import { RateTableComponent } from '../components/rate-table/rate-table.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabsPageRoutingModule,
    MapComponentComponent,
    BarChartComponent,
    QChartComponent,
    BoxPlotComponent,
    RateTableComponent
  ],
  declarations: [TabsPage]
})
export class TabsPageModule { }
