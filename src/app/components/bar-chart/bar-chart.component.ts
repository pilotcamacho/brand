import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent } from 'chart.js';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
// import { IonButton } from "@ionic/angular/standalone";
import { Chart, CategoryScale, BarController, BarElement, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { CountyDataSrvService } from 'src/app/services/county-data/county-data-srv.service';
import { ColumnData } from 'src/app/services/county-data/county-data-i';
// import { CountyInfo } from 'src/app/services/county-data/county-info';
import { IonToggle } from "@ionic/angular/standalone";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
  standalone: true,
  imports: [IonToggle, BaseChartDirective, FormsModule],
})
export class BarChartComponent implements OnInit, AfterViewInit, OnChanges {

  sordByValue: boolean = false;

  @Input() selectedColumn!: ColumnData;

  @Input() selectedCounty: string = 'Los Angeles';

  @ViewChild(BaseChartDirective) chart: BaseChartDirective<'bar'> | undefined;

  constructor(private cds: CountyDataSrvService) {
    console.log('BarChartComponent::constructor:: ' + cds)
    Chart.register(
      CategoryScale,
      BarController,
      BarElement,
      LinearScale,
      Title,
      Tooltip,
      Legend
    );
  }

  ngOnInit() {
    console.log('BarChartComponent::ngOnInit')
  }

  ngAfterViewInit(): void {
    console.log('BarChartComponent::ngAfterViewInit')
    this.initChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('BarChartComponent::ngOnChanges')
    if (changes['selectedColumn']) {
      console.log('Data selectedColumnbar-chart:', this.selectedColumn);
      this.updateData()
    }
    if (changes['selectedCounty']) {
      console.log('Data selectedCounty:', this.selectedCounty);
      this.updateData()
    }
  }

  private initChart(): void {
    console.log('BarChartComponent::initChart')
    console.log('this.selectedColumn:' + this.selectedColumn)
  }


  title = 'ng2-charts-demo';

  public barChartLegend = false;
  public barChartPlugins = [];

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['casa', '2007', '2008', '2009', '2010', '2011', '2012'],
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'
        , backgroundColor: [
          'rgba(0, 0, 132, 0.2)'
        ],
        borderColor: [
          'rgba(0, 0, 132, 1)'
        ],
        borderWidth: 1
      }
    ]
  };


  public updateData(): void {
    // const countyMap = this.cds.values_by_county('CA', this.selectedColumn.code as keyof CountyInfo, this.sordByValue)

    // this.barChartData.labels = Array.from(countyMap.keys());
    // this.barChartData.datasets[0].data = Array.from(countyMap.values());
    // this.barChartData.datasets[0].label = this.selectedColumn.name;
    // this.barChartData.datasets[0].backgroundColor = Array.from(countyMap.keys()).map(x => this.getColorForSelected(x));
    // this.barChartData.datasets[0].borderColor = Array.from(countyMap.keys()).map(x => this.getColorForSelected(x));


    this.chart?.update();
  }

  getColorForSelected(county: string) {
    return county == this.selectedCounty ? 'rgba(192, 64, 0, 1)' : 'rgba(0, 0, 255, 0.27)'
  }

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,            // Chart resizes with the window
    maintainAspectRatio: false,   // Allow the chart to stretch to fill height
    scales: {
      y: {
        beginAtZero: true,         // Y-axis starts from 0
        ticks: {
          // Customizing the Y-axis number format
          callback: function (value: any) {
            // Format numbers with commas (for thousands)
            return new Intl.NumberFormat('en-US').format(value);
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false,           // Show the legend
        position: 'bottom'          // Place the legend at the top
      },
      tooltip: {
        enabled: true            // Enable tooltips on hover
      }
    }
  };

  // events
  public chartClicked({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
    // console.log(event, active);
  }


  // Method to track toggle change
  onToggleChange(event: any) {
    const isChecked = event.detail.checked;
    console.log('Toggle changed:', isChecked);

    // You can add any logic here to handle the change
    if (isChecked) {
      console.log('Notifications enabled');
      this.sordByValue = true
    } else {
      console.log('Notifications disabled');
      this.sordByValue = false
    }
    this.updateData()

  }

}