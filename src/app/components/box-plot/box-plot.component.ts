import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';

// Import Chart.js and the box-plot plugin
import { Chart, ChartConfiguration, ChartData, ChartOptions } from 'chart.js';
import { BoxPlotController, BoxAndWiskers } from '@sgratzl/chartjs-chart-boxplot';
import { BaseChartDirective } from 'ng2-charts';  // Import NgChartsModule for Chart.js integration
import { ColumnData } from 'src/app/services/county-data/county-data-i';
import { CountyDataSrvService } from 'src/app/services/county-data/county-data-srv.service';
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

  @Input() selectedColumn!: ColumnData;

  @ViewChild(BaseChartDirective) chart: BaseChartDirective<'boxplot'> | undefined;


  constructor(private cds: CountyDataSrvService) { }

  ngOnInit() {
    console.log('BoxPlotComponent::ngOnInit');
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('BoxPlotComponent::ngOnChanges')
    if (changes['selectedColumn']) {
      console.log('Data selectedColumn:box-plot::', this.selectedColumn);
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


  public boxPlotChartData: ChartConfiguration<'boxplot'>['data'] = {
    labels: ['A', 'B', 'C', 'D'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [
          this.randomValues(100, 0, 100),
          this.randomValues(100, 0, 20, [110]),
          this.randomValues(100, 20, 70),
          // empty data
          [],
        ],
      },
    ],
  }


  public updateData(): void {
    console.log('BoxPlotComponent::updateData')
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
