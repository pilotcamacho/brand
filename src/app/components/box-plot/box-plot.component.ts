import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';

// Import Chart.js and the box-plot plugin
import { Chart, ChartConfiguration, ChartData, ChartOptions } from 'chart.js';
import { BoxPlotController, BoxAndWiskers, BoxPlotDataPoint } from '@sgratzl/chartjs-chart-boxplot';
import { BaseChartDirective } from 'ng2-charts';  // Import NgChartsModule for Chart.js integration
import { ColumnData } from 'src/app/services/county-data/county-data-i';
import { CountyDataSrvService } from 'src/app/services/county-data/county-data-srv.service';
import { DataPoint } from '../map-component/map-input';
// import { CountyInfo } from 'src/app/services/county-data/county-info';


// Register the box-plot components with Chart.js
Chart.register(BoxPlotController, BoxAndWiskers);

@Component({
  selector: 'app-box-plot',
  templateUrl: './box-plot.component.html',
  styleUrls: ['./box-plot.component.scss'],
  standalone: true,
  imports: [BaseChartDirective]
})
export class BoxPlotComponent implements OnInit, OnChanges {

  @Input() data: DataPoint[] = [];

  @ViewChild(BaseChartDirective) chart: BaseChartDirective<'boxplot'> | undefined;


  constructor(private cds: CountyDataSrvService) { }

  ngOnInit() {
    console.log('BoxPlotComponent::ngOnInit');
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('BoxPlotComponent::ngOnChanges')
    if (changes['data']) {
      // console.log('BoxPlotComponent::ngOnChanges::data', this.data);
      this.updateData()
    }
  }

  randomValues(count: number, min: number, max: number, extra: number[] = []): number[] {
    const delta = max - min;
    return [...Array.from({ length: count }).map(() => Math.random() * delta + min), ...extra];
  }

  // Configuration for the box plot chart
  public boxPlotChartOptions: ChartOptions<'boxplot'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'top'
      },
    },
  };

  public boxPlotChartType: 'boxplot' = 'boxplot';  // This fixes the error  // Set the chart type to boxplot


  // public boxPlotChartData: ChartConfiguration<'boxplot'>['data'] = {
  //   labels: ['A', 'B', 'C', 'D'],
  //   datasets: [
  //     {
  //       label: 'Dataset 1',
  //       data: [
  //         this.randomValues(100, 0, 100),
  //         this.randomValues(100, 0, 20, [110]),
  //         this.randomValues(100, 20, 70),
  //         // empty data
  //         [],
  //       ],
  //     },
  //   ],
  // }

  public boxPlotChartData: ChartConfiguration<'boxplot'>['data'] = {
    labels: this.readLables(),
    datasets: [
      {
        label: 'Title',
        data: this.readData(),
      },
    ],
  };

  readLables(): string[] {

    return this.data
      .sort((a, b) => a.subRegion.localeCompare(b.subRegion))
      .map(dp => dp.subRegion)
  }


  readData(): BoxPlotDataPoint[] {

    // { min: 2, q1: 10, median: 15, q3: 18, max: 20, outliers: [90] }, // B with an outlier
    // { min: 20, q1: 30, median: 45, q3: 60, max: 70 }, // C
    return this.data
      .sort((a, b) => a.subRegion.localeCompare(b.subRegion))
      .map(dp => {
        return {
          min: dp.quantiles.q10,
          q1: dp.quantiles.q25,
          median: dp.quantiles.q50,
          q3: dp.quantiles.q75,
          max: dp.quantiles.q90
        }
      })
  }


  public updateData(): void {
    console.log('BoxPlotComponent::updateData')

    this.boxPlotChartData = {
      labels: this.readLables(),
      datasets: [
        {
          label: 'Title',
          data: this.readData(),
        },
      ],
    }

    // const countyMap = this.cds.values_by_county('CA', this.selectedColumn.code as keyof CountyInfo, true)

    // this.boxPlotChartData.labels = ['']; //[this.selectedColumn.name];
    // this.boxPlotChartData.datasets[0].data = [Array.from(countyMap.values())];
    // concelled until here for map testing



    // this.boxPlotChartData.datasets[0].label = this.selectedColumn.name;
    // this.boxPlotChartData.datasets[0].backgroundColor = Array.from(countyMap.keys()).map(x => this.getColorForSelected(x));
    // this.boxPlotChartData.datasets[0].borderColor = Array.from(countyMap.keys()).map(x => this.getColorForSelected(x));

    // // Only Change 3 values
    // this.barChartData.datasets[0].data = [
    //   Math.round(Math.random() * 100),
    //   59,
    //   80,
    //   Math.round(Math.random() * 100),
    //   56,
    //   Math.round(Math.random() * 100),
    //   40,
    // ];

    this.chart?.update();
  }
}
