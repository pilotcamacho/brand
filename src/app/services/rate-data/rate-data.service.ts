import { Injectable } from '@angular/core';
import { numberNull, RATE_CODES, RATE_DATA, RATE_SERVICES } from './rate-data';

@Injectable({
  providedIn: 'root'
})
export class RateDataService {



  rateServices = RATE_SERVICES;
  // private rate_labels: string[] = RATE_LABELS;
  // private rate_labels_median: string[] = RATE_LABELS_MEDIAN;
  rate_codes: { "cpt_code": number, "description": string, "purpose": string, "duration": string }[] = RATE_CODES;
  rate_data: numberNull[][][] = RATE_DATA;

  groupedByPayer = RATE_SERVICES.reduce((acc: { [key: string]: number[] }, service) => {
    const { payer, id } = service;

    // Initialize payer entry if it doesn't exist
    if (!acc[payer]) {
      acc[payer] = [];
    }

    // Push the id (index) to the payer's sublist
    acc[payer].push(id);

    return acc;
  }, {});


  constructor() { }

  // Function to get the list of network values
  getNetworks() {
    return this.rateServices.map(service => service.network);
  }

  getPayers() {
    return Object.keys(this.groupedByPayer);
  }

  getIdxForPayers(): number[] {
    const firstElements = Object.entries(this.groupedByPayer).map(([payer, indices]) => {
      return indices[0];
    });
    return firstElements;
  }

  // getData(selectedCode: number) {
  //   const codeIdx = this.rate_codes.findIndex(rateCode => rateCode.cpt_code === selectedCode);
  //   // console.log('getData::codeIdx', codeIdx)
  //   // console.log("getArrayDimensions::RATE_DATA[codeIdx]::A:: " + this.getArrayDimensions(RATE_DATA[codeIdx]))
  //   const theData = JSON.parse(JSON.stringify(RATE_DATA[codeIdx]));
  //   const dataCode = this.addColumns(theData)
  //   // console.log("getArrayDimensions::RATE_DATA[codeIdx]::B:: " + this.getArrayDimensions(RATE_DATA[codeIdx]))
  //   // console.log('dataCode::' + dataCode)
  //   const diffs = dataCode.map(row => this.calculateDifferences(row))
  //   // console.log('diffs::' + diffs)

  //   // const dd = this.transpose(diffs.map((d, idxService) => this.makePairs(d, dataCode[idxService][0])));

  //   const dd = this.transpose(diffs);
  //   // const newFirstRow: [number, number][] = dd[0].map((d, idx) => {
  //   //   let v = dataCode[idx][0];
  //   //   if (v === null) { v = 0 }
  //   //   return [v, v + d]
  //   // })
  //   // dd[0] = newFirstRow;
  //   // console.log('newFirstRow::' + newFirstRow)

  //   return dd.map((d, idx) => ({
  //     "data": d, "label": this.rate_labels_median[idx], "stack": 'a', "backgroundColor": this.getColorByIndex(idx),
  //     "borderWidth": (idx == 4 ? 6 : 0), "borderColor": 'red',
  //   }));
  // }

}


