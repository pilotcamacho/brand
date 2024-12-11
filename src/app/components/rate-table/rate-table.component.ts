import { CommonModule } from '@angular/common';

import { Component, OnInit } from '@angular/core';
import { RateDataService } from 'src/app/services/rate-data/rate-data.service';

import { ColumnMode, } from '@swimlane/ngx-datatable';
import { numberNull } from 'src/app/services/rate-data/rate-data';
import { CodeData } from 'src/app/services/rate-data/rate-data-i';
import { IonGrid, IonRow, IonCol, IonList, IonListHeader, IonLabel, IonRadio, IonRadioGroup, IonItem } from '@ionic/angular/standalone';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';  // Import this for ngModel


@Component({
  selector: 'app-rate-table',
  templateUrl: './rate-table.component.html',
  styleUrls: ['./rate-table.component.scss'],
  standalone: true,
  imports: [NgxDatatableModule, CommonModule, FormsModule,
    IonItem, IonRadioGroup, IonGrid, IonRow, IonCol, IonList, IonListHeader, IonLabel, IonRadio, IonRadioGroup],
})
export class RateTableComponent implements OnInit {


  rows: any[] = []
  rowsHiden: any[] = []

  // listOfCodes: {codeData: CodeData, selected: boolean}[];
  // selectedCode: {codeData: CodeData, selected: boolean}[];
  listOfCodes: CodeData[];
  selectedCode: CodeData;


  // rows = [
  //   {
  //     "name": "Ethel Price",
  //     "gender": "female",
  //     "company": "Johnson, Johnson and Partners, LLC CMP DDC",
  //     "age": 22,
  //     "treeStatus": "expanded"
  //   },
  //   {
  //     "name": "Claudine Neal",
  //     "gender": "female",
  //     "company": "Sealoud",
  //     "age": 55,
  //     "treeStatus": "disabled"
  //   },
  //   {
  //     "name": "Beryl Rice",
  //     "gender": "female",
  //     "company": "Velity",
  //     "age": 67,
  //     "treeStatus": "disabled"
  //   },
  //   {
  //     "name": "Wilder Gonzales",
  //     "gender": "male",
  //     "company": "Geekko",
  //     "treeStatus": "disabled"
  //   },
  //   {
  //     "name": "Georgina Schultz",
  //     "gender": "female",
  //     "company": "Suretech",
  //     "treeStatus": "expanded"
  //   },
  //   {
  //     "name": "Carroll Buchanan",
  //     "gender": "male",
  //     "company": "Ecosys",
  //     "treeStatus": "disabled"
  //   },
  //   {
  //     "name": "Valarie Atkinson",
  //     "gender": "female",
  //     "company": "Hopeli",
  //     "treeStatus": "disabled"
  //   },
  //   {
  //     "name": "Schroeder Mathews",
  //     "gender": "male",
  //     "company": "Polarium",
  //     "manager": "Ethel Price",
  //     "treeStatus": "disabled"
  //   },
  //   {
  //     "name": "Lynda Mendoza",
  //     "gender": "female",
  //     "company": "Dogspa",
  //     "manager": "Georgina Schultz",
  //     "treeStatus": "disabled"
  //   }
  // ]

  ColumnMode = ColumnMode;

  groupedByPayer: { [key: string]: number[] };

  selectedCodeIdx: number = 0;
  p025ValueForCode: number;
  p050ValueForCode: number;
  p075ValueForCode: number;

  showSelectColumn: boolean = false;


  constructor(private rateDataSrv: RateDataService) {
    // this.rows = this.rateDataSrv.rateServices.map((s) => { return { payer: s.payer, network: s.network } });
    this.groupedByPayer = this.rateDataSrv.groupedByPayer;
    const { Q1, Q2, Q3 } = calculateQuartiles(this.rateDataSrv.rate_data[this.selectedCodeIdx]);
    this.p025ValueForCode = Q1;
    this.p050ValueForCode = Q2;
    this.p075ValueForCode = Q3

    this.listOfCodes = this.rateDataSrv.rate_codes; //.map(cd => ({codeData: cd, selected: false}));
    // this.listOfCodes[0].selected = true;
    this.selectedCode = this.listOfCodes[0];

    this.rows = this.rateServicesTable(this.selectedCodeIdx);

    console.log("TestPage::constructor::", this.listOfCodes);
  }


  onTreeAction(event: any) {
    console.log("TestPage::onTreeAction::", event);
    const index = event.rowIndex;
    const row = event.row;
    if (row.treeStatus === 'expanded') {
      row.treeStatus = 'collapsed';
    } else {
      row.treeStatus = 'expanded';
    }
    this.rows = [...this.rows];
  }

  ngOnInit() {
    console.log("TestPage::ngOnInit()");
  }

  rateServicesTable(selectedCodeIdx: number): any[] {
    // console.log('RateDataService::rateServicesTable:' + JSON.stringify(this.groupedByPayer))

    const o: any[] = []
    Object.entries(this.groupedByPayer).map((key, idx) => {
      o.push({ network: key[0], ...this.getRateData(selectedCodeIdx, key[1]), shouldBeBold: true })
      // console.log('RateDataService::rateServicesTable::id: ' + key[1])

      key[1].map((id) => {
        o.push({ network: this.rateDataSrv.rateServices[id].network, payer: this.rateDataSrv.rateServices[id].payer, ...this.getRateData(selectedCodeIdx, [id]), shouldBeBold: false })
      })

    })
    // console.log('RateDataService::rateServicesTable:' + JSON.stringify(o))

    return o;
  }

  getRateData(code_pos: number, ids: number[]) {

    const v005 = getAverage(ids.map(id => (this.rateDataSrv.rate_data[code_pos][id][0])))
    const v010 = getAverage(ids.map(id => (this.rateDataSrv.rate_data[code_pos][id][1])))
    const v025 = getAverage(ids.map(id => (this.rateDataSrv.rate_data[code_pos][id][2])))
    const v050 = getAverage(ids.map(id => (this.rateDataSrv.rate_data[code_pos][id][3])))
    const v075 = getAverage(ids.map(id => (this.rateDataSrv.rate_data[code_pos][id][4])))
    const v090 = getAverage(ids.map(id => (this.rateDataSrv.rate_data[code_pos][id][5])))
    const v095 = getAverage(ids.map(id => (this.rateDataSrv.rate_data[code_pos][id][6])))

    return {
      p005: v005 !== null ? Number(v005.toFixed(2)) : null,
      p010: v010 !== null ? Number(v010.toFixed(2)) : null,
      p025: v025 !== null ? Number(v025.toFixed(2)) : null,
      p050: v050 !== null ? Number(v050.toFixed(2)) : null,
      p075: v075 !== null ? Number(v075.toFixed(2)) : null,
      p090: v090 !== null ? Number(v090.toFixed(2)) : null,
      p095: v095 !== null ? Number(v095.toFixed(2)) : null,
    }
  }



  getColor(value: number): string {
    if (value >= this.p075ValueForCode) {
      return 'red';
    } else if (value >= this.p050ValueForCode) {
      return 'orange';
    } else if (value >= this.p025ValueForCode) {
      return 'green';
    } else {
      return 'blue';
    }
  }

  getStyle(value: number, shouldBeBold: boolean): {} {
    if (value >= this.p075ValueForCode) {
      return { 'color': 'red', 'font-weight': shouldBeBold ? 'bold' : 'normal' }
    } else if (value >= this.p050ValueForCode) {
      return { 'color': 'orange', 'font-weight': shouldBeBold ? 'bold' : 'normal' }
    } else if (value >= this.p025ValueForCode) {
      return { 'color': 'green', 'font-weight': shouldBeBold ? 'bold' : 'normal' }
    } else {
      return { 'color': 'blue', 'font-weight': shouldBeBold ? 'bold' : 'normal' }
    }
    return {}
  }

  onCodeChange(event: any) {
    // console.log("TestPage::onCodeChange::event:", event);
    // console.log("TestPage::onCodeChange::listOfCodes:", this.listOfCodes);
    // console.log("TestPage::onCodeChange::selectedCode:", this.selectedCode);

    const idx = this.listOfCodes.findIndex((cd: CodeData) => cd.cpt_code === this.selectedCode.cpt_code)


    const { Q1, Q2, Q3 } = calculateQuartiles(this.rateDataSrv.rate_data[idx]);
    this.p025ValueForCode = Q1;
    this.p050ValueForCode = Q2;
    this.p075ValueForCode = Q3
    const rowsNew = this.rateServicesTable(idx).map(rn => ({ ...rn, selected: this.wasSelected(rn) }))
    rowsNew.forEach(rn => (rn.treeStatus = this.wasExpanded(rn) ? 'expanded' : 'colapsed'))

    this.rows = rowsNew



    // const isChecked = event.detail.checked;
    // console.log('Code changed:', event.detail.value);
    // this.selectedCode = event.detail.value
    // // this.qChartData = this.getQChartDataFromSelectedCode(this.selectedCode, this.byPayer)
    // this.qChartData = this.getQChartDataFromSelectedCodeSelectedNetworks(this.selectedCode,
    //    this.listOfSelectedNetworks.filter(sn => sn.selected).map(sn => sn.code))
    // // console.log('TabsPage::onCodeChange::this.qChartData: ' + JSON.stringify(this.qChartData))
  }

  wasExpanded(row: any): boolean {
    let wasExpanded = false;
    this.rows.filter(r => r.network === row.network).forEach(r => wasExpanded = wasExpanded || r.treeStatus === 'expanded');
    return wasExpanded
  }

  wasSelected(row: any): boolean {
    let wasSelected = false;
    this.rows.filter(r => r.network === row.network).forEach(r => wasSelected = wasSelected || r.selected);
    return wasSelected
  }

  hideRow(row: any) {
    // Logic to hide the row
    this.rows = this.rows.filter(r => r !== row);
    this.rowsHiden.push(row);
  }

  onCheckboxChange(event: any) {
    console.log("TestPage::onCheckboxChange::event: ", event);
    // console.log("TestPage::onCheckboxChange::event::event.payer: ", event.payer);
    const newState = event.selected;
    // console.log("TestPage::onCheckboxChange::newState: ", newState);

    const isPayer = event.payer === undefined;
    // console.log("TestPage::onCheckboxChange::isPayer: ", isPayer);

    if (isPayer) {
      this.rows.filter(row => row.payer === event.network) // Children
        .forEach(row => {
          // console.log("TestPage::onCheckboxChange::row: ", row);
          row.selected = newState;
        });
      return;
    }

    let atLeastOneChildrenSelected = false;
    this.rows.filter(row => row.payer === event.payer) // Brothers
      .forEach(row => {
        // console.log("TestPage::onCheckboxChange::row: ", row);
        atLeastOneChildrenSelected = atLeastOneChildrenSelected || row.selected;
      });

    this.rows.filter(row => row.network === event.payer) // Parent      
      .forEach(row => {
        // console.log("TestPage::onCheckboxChange::row: ", row);
        if (atLeastOneChildrenSelected) row.selected = true;
        else row.selected = false;
        ;
      });

  }

  onHeaderClick() {
    console.log("TestPage::onHeaderClick::");
    this.showSelectColumn = !this.showSelectColumn;
    // this.rows = this.rows
  }

  get filteredRows() {
    return this.rows.filter(row => row.selected || !this.showSelectColumn);
  }

}


function getAverage(arr: numberNull[]): numberNull {

  const noNullArr = arr.filter((item): item is number => item !== null);

  const sum = noNullArr.reduce((acc, curr) => acc + curr, 0);
  return noNullArr.length === 0 ? null : sum / noNullArr.length;
}

function calculateQuartiles(data: numberNull[][]): { Q1: number, Q2: number, Q3: number } {
  // Step 1: Flatten the 2D array into a 1D array
  const flattened: number[] = flat(data).filter((item): item is number => item !== null);

  // Step 2: Sort the flattened array
  const sorted = flattened.sort((a, b) => a - b);

  // Helper function to calculate median of an array
  function median(arr: number[]): number {
    const mid = Math.floor(arr.length / 2);
    if (arr.length % 2 === 0) {
      // If even, return the average of the two middle elements
      return (arr[mid - 1] + arr[mid]) / 2;
    } else {
      // If odd, return the middle element
      return arr[mid];
    }
  }

  // Step 3: Calculate Q1, Q2, and Q3
  const Q2 = median(sorted); // Median (Q2)
  const midIndex = Math.floor(sorted.length / 2);

  const lowerHalf = sorted.slice(0, midIndex); // First half of the array
  const upperHalf = sorted.slice(sorted.length % 2 === 0 ? midIndex : midIndex + 1); // Second half of the array

  const Q1 = median(lowerHalf); // First quartile (Q1)
  const Q3 = median(upperHalf); // Third quartile (Q3)

  return { Q1, Q2, Q3 };
}

function flat<T>(array: T[][]): T[] {
  const flattenedArray: T[] = [];

  // Loop through each row of the 2D array
  for (let i = 0; i < array.length; i++) {
    // Append each element of the row to the flattened array
    for (let j = 0; j < array[i].length; j++) {
      flattenedArray.push(array[i][j]);
    }
  }

  return flattenedArray;
}

