import { AfterViewInit, Component, forwardRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, Color } from 'chart.js';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { Chart, CategoryScale, BarController, BarElement, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { IonToggle, IonSelect, IonSelectOption, IonItem } from "@ionic/angular/standalone";
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgFor } from '@angular/common';
import { qChartComponentDataI } from './q-chart.component-data-i';
import { numberNull } from 'src/app/services/rate-data/rate-data';

@Component({
  selector: 'app-q-chart',
  templateUrl: './q-chart.component.html',
  styleUrls: ['./q-chart.component.scss'],
  standalone: true,
  imports: [IonItem, IonToggle, BaseChartDirective, FormsModule, IonSelect, IonSelectOption, NgFor],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => QChartComponent),
      multi: true,
    }
  ]
})
export class QChartComponent implements OnInit, AfterViewInit, OnChanges {

  @Input()
  qChartData: qChartComponentDataI = {
    lables: ['L1'],
    data: [[1, 2, 3, 4, 5, 6, 7]]
  }
  // selectedCode: number = 97153;

  @ViewChild(BaseChartDirective) chart: BaseChartDirective<'bar'> | undefined;

  // listOfCodes: number[] = this.cds.rate_codes.map(c => c.cpt_code);

  theData: { "data": number[] | [number, number][], "label": string, "stack": string; }[] = [{ "data": [0, 0, 0, 0, 0, 0, 0], "label": 'L1', "stack": 'S1' }]

  RATE_LABELS: string[] = ["Rate (5th Percentile)", "Rate (10th Percentile)", "Rate (25th Percentile)", "Rate (50th Percentile)", "Rate (75th Percentile)", "Rate (90th Percentile)", "Rate (95th Percentile)"]

  RATE_LABELS_MEDIAN: string[] = ["Rate (5th Percentile)", "Rate (10th Percentile)", "Rate (25th Percentile)", "MEDIAN", "Rate (50th Percentile)", "Rate (75th Percentile)", "Rate (90th Percentile)", "Rate (95th Percentile)"]


  constructor() {
    console.log('QChartComponent::constructor:: ')
    Chart.register(
      CategoryScale,
      BarController,
      BarElement,
      LinearScale,
      Title,
      Tooltip,
      Legend
    );

    // console.log("QChartComponent::constructor::this.theData::A::" + JSON.stringify(this.theData))
    this.theData = this.getData();
    // console.log("QChartComponent::constructor::this.theData::B::" + JSON.stringify(this.theData))

  }

  getData() {

    const theData = JSON.parse(JSON.stringify(this.qChartData.data));
    // console.log("QChartComponent::getData::theData::A::" + theData)
    const dataCode = this.addColumns(theData)
    // console.log("getArrayDimensions::RATE_DATA[codeIdx]::B:: " + this.getArrayDimensions(dataCode))
    // console.log('dataCode::' + dataCode)
    const diffs = dataCode.map(row => this.calculateDifferences(row))
    // console.log('diffs::' + diffs)

    // const dd = this.transpose(diffs.map((d, idxService) => this.makePairs(d, dataCode[idxService][0])));

    const dd = this.transpose(diffs);
    // const newFirstRow: [number, number][] = dd[0].map((d, idx) => {
    //   let v = dataCode[idx][0];
    //   if (v === null) { v = 0 }
    //   return [v, v + d]
    // })
    // dd[0] = newFirstRow;
    // console.log('newFirstRow::' + newFirstRow)

    return dd.map((d, idx) => ({
      "data": d, "label": this.RATE_LABELS_MEDIAN[idx], "stack": 'a', "backgroundColor": this.getColorByIndex(idx),
      "borderWidth": (idx == 4 ? 6 : 0), "borderColor": 'red',
    }));
  }

  transpose<T>(matrix: T[][]): T[][] {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
  }

  // makePairs(diffs: number[], initialValue: numberNull): [number, number][] {
  //   const pairs: [number, number][] = [];
  //   return diffs.map((value, idx) => [idx == 0 ? (initialValue === null ? 0 : initialValue) : 0, value]);
  // }

  // Function to calculate the difference between consecutive values in a vector
  calculateDifferences(vector: numberNull[]): number[] {
    // Map through the vector and subtract the previous value from the current one
    return vector.slice(1).map((value, index) => {
      const previousValue = vector[index];
      // Check if either value or previousValue is null, return 0 if true
      if (value === null || previousValue === null) {
        return 0;
      }
      // Return the difference otherwise
      return value - previousValue;
    });
  }

  addColumns(arr: numberNull[][]) {
    return arr.map(row => {
      // Add 0 at the start
      row.unshift(0);

      const valueToAdd = 1;

      // Add the same value from the middle column (based on the length of the row)
      const middleIndex = 5;

      const value = row[middleIndex - 1];
      if (value != null)
        row.splice(middleIndex, 0, value + valueToAdd);

      // Add 2 to all elements that come after the middle insertion
      for (let i = middleIndex + 1; i < row.length; i++) {
        const v = row[i];
        if (v != null) {
          row[i] = v + valueToAdd;
        }
      }

      return row;
    });
  }

  getArrayDimensions(arr: any[]): number[] {
    const dimensions = [];
    let currentArray = arr;

    while (Array.isArray(currentArray)) {
      dimensions.push(currentArray.length);
      currentArray = currentArray[0];  // Move to the next nested array
    }

    return dimensions;
  }


  // colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#33FFF1', '#F1FF33'];
  // colors = [
  //   '#ffb3b3', // Dim red
  //   '#ff6666', // Medium red
  //   '#ff3333', // Strong red (middle)
  //   '#ff0000', // Strong red (middle)
  //   '#ff6666', // Medium red
  //   '#ffb3b3'  // Dim red
  // ];
  colors = [
    'rgba(0, 0, 0, 0.0)',
    'hsl(240, 100%, 90%)', // Dim blue
    'hsl(240, 100%, 80%)', // Slightly stronger blue
    'hsl(240, 100%, 50%)', // Medium blue
    'red',
    'hsl(240, 100%, 50%)', // Strong blue (middle)
    'hsl(240, 100%, 80%)', // Slightly stronger blue
    'hsl(240, 100%, 90%)',  // Dim blue
  ]
  getColorByIndex(index: number): string {
    // console.log('getColorByIndex::' + index + " ::: " + (index % this.colors.length) + "::::" + this.colors[index % this.colors.length])
    return this.colors[index % this.colors.length]; // Ensures index wraps around if it's larger than 5
  }




  ngOnInit() {
    console.log('QChartComponent::ngOnInit')
  }

  ngAfterViewInit(): void {
    console.log('QChartComponent::ngAfterViewInit')
    this.initChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('QChartComponent::ngOnChanges')
    if (changes['qChartData']) {
      // console.log('Data qChartData:', JSON.stringify(this.qChartData));
      this.updateChart()
    }
  }

  getLable(dataIndex: number, datasetIndex: number) {
    const middleIndex = 5;
    return this.qChartData.data[dataIndex][datasetIndex >= middleIndex ? datasetIndex - 1 : datasetIndex]
  }

  private initChart(): void {
    // console.log('QChartComponent::initChart')
    // console.log(JSON.stringify(this.cds.getData(this.selectedCode)))
    // console.log('this.selectedColumn:' + this.selectedColumn)
    // this.cds.getData().forEach(element => {
    //   console.log('element: ' + JSON.stringify(element))
    // })
    // console.log(this.theData)
  }


  title = 'Chart';

  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: this.qChartData.lables,
    datasets: this.theData,
  };

  public updateChart(): void {
    console.log('QChartComponent::updateChart')
    this.barChartData.labels = this.qChartData.lables;
    this.barChartData.datasets = this.getData();
    this.chart?.update();
  }

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,            // Chart resizes with the window
    maintainAspectRatio: false,   // Allow the chart to stretch to fill height
    scales: {
      y: {
        beginAtZero: true,         // Y-axis starts from 0
        ticks: {
          callback: function (value) {
            return '$' + value.toLocaleString();  // Formatting values as currency
          }
        }
      },
      x: {
        beginAtZero: true,
        ticks: {
          // Rotate the labels to 90 degrees for vertical orientation
          minRotation: 90,
          maxRotation: 90,
        }
      }
    },
    plugins: {
      legend: {
        display: false,           // Show the legend
        position: 'bottom'          // Place the legend at the top
      },
      tooltip: {
        enabled: true,            // Enable tooltips on hover
        callbacks: {  // Customize the tooltip's content
          label: (tooltipItem: any) => {
            // console.log(tooltipItem)
            const label = tooltipItem.dataset.label || '';
            const dataIndex = tooltipItem.dataIndex;
            const datasetIndex = tooltipItem.datasetIndex;
            // const value1 = this.cds.rate_data[this.cds.rate_codes.indexOf(this.selectedCode)][dataIndex][datasetIndex]
            // const value2 = this.cds.rate_data[this.cds.rate_codes.indexOf(this.selectedCode)][dataIndex][datasetIndex]
            const value2 = this.getLable(dataIndex, datasetIndex)
            return `${label}: $${value2}`;
          }
        }
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
    this.updateChart();
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
  onCodeChange(event: any) {
    const isChecked = event.detail.checked;
    console.log('Code changed:', event.detail.value);
    this.updateChart()
  }
}