import { Injectable } from '@angular/core';
import { ColumnData, ColumnRenameByState, CountyData } from './county-data-i';
import { COLUMNS_DATA, COLUMNS_RENAME_BY_STATE, COUNTY_DATA } from './county-data';
import { DataRowByCounty } from './county-info';
import { ColumnInfoByRegion } from './column-info';
import { Region, RegionType } from 'src/app/components/map-component/map-input';

@Injectable({
  providedIn: 'root'
})
export class CountyDataSrvService {

  private data: CountyData[] = COUNTY_DATA;
  private columns: ColumnData[] = COLUMNS_DATA;
  private rename: ColumnRenameByState[] = COLUMNS_RENAME_BY_STATE;

  // private stateInfo!: DataRowByCounty[];
  private columnsInfo!: ColumnInfoByRegion[];

  constructor() {
    console.log("CountyDataSrvService::constructor()")
    this.updateCountiesData({ type: RegionType.COUNTRY, name: 'USA', code: 'USA', codeFP: '' });
  }

  getStateInfo(region: Region): ColumnInfoByRegion[] {
    this.updateCountiesData(region);
    return this.columnsInfo
  }

  updateCountiesData(region: Region) {
    console.log("CountyDataSrvService::updateCountiesData()::region: " + JSON.stringify(region))
    const stateInfo = this.data
      .filter((countyData) => (countyData.state === region.code))
      .map((countyData) => new DataRowByCounty(countyData));
    this.columnsInfo = this.columns.map((colData) => {
      colData.name = this.replaceNameByState(region, colData.code, colData.name)
      if (colData.code === 'area' || colData.code === 'pop_density') {
        return new ColumnInfoByRegion('general', region, colData, stateInfo);
      } else {
        return new ColumnInfoByRegion('medicare', region, colData, stateInfo);
      }
    });
    // console.log(">>>>>> CountyDataSrvService::updateCountiesData()::this.columnsInfo: " + JSON.stringify(this.columnsInfo))
    // this.columns.forEach(col => { console.log(col.code + " - " + col.min + " - " + col.max) })
  }

  replaceNameByState(region: Region, code: string, originalName: string): string {
    const found = this.rename.find(item => (item.state === region.code) && (item.code === code));
    return found ? found.name : originalName;
  }

  getParameters(region: Region): ColumnInfoByRegion[] {
    this.updateCountiesData(region)
    // console.log("CountyDataSrvService::getParameters()::this.columnsInfo: " + JSON.stringify(this.columnsInfo))
    return this.columnsInfo.filter(column => (column.type === "number" as keyof DataRowByCounty));
  }

  // valfromstring(countyName: string, fieldName: keyof CountyData): number {
  //   const found = this.data.find(item => item.county_name === countyName);
  //   return found ? found[fieldName] : 0;
  // }

  min_and_max_values(state: string, field: keyof DataRowByCounty): [number | null, number | null, string] {
    const colFound = this.columnsInfo.find(item => item.code === field)
    if (typeof colFound !== 'undefined') {
      return [colFound.min, colFound.max, colFound.format]
    } else {
      return [null, null, 'N/A']
    }
  }

  val_norm_from_string<T>(stateId: string, countyName: string, field: keyof DataRowByCounty): [number | null, number | null, string] {
    // console.log("CountyDataSrvService::val_norm_from_string::countyName::" + countyName + "::field: " + field)
    const colFound = this.columnsInfo.find(item => (item.code === field))
    if (typeof colFound !== 'undefined') {
      console.log("CountyDataSrvService::val_norm_from_string::colFound::" + colFound.code + "::field: " + field)
      const valFromString = this.valfromstring(stateId, countyName, field)
      if (valFromString === null) {
        return [null, null, 'N/A']
      }
      return [(valFromString - colFound.min) / (colFound.max - colFound.min), valFromString, colFound.format]
    } else {
      console.log("--->>>>CountyDataSrvService::val_norm_from_string::colFound::" + colFound + "::field: " + field)
      return [null, null, 'N/A']
    }
  }

  private valfromstring<T>(stateId: string, countyName: string, field: keyof DataRowByCounty): number | null {
    if (countyName === 'Washington')
      console.log("CountyDataSrvService::valfromstring::stateId | countyName::" + stateId + " | " + countyName + "::field: " + field)
    const found = this.data.find(item => (item.state === stateId && item.county_name === countyName));
    if (found) {
      const fieldValue = new DataRowByCounty(found)[field];
      // Check if the field value is a string or number
      if (typeof fieldValue === 'string') {
        return 0;
      } else if (typeof fieldValue === 'number') {
        return fieldValue;
      }
    }
    return null;
  }

  // values_by_county(stateId:string, field: keyof stateInfo, orderByValue: boolean): Map<string, number> {
  //   console.log("CountyDataSrvService::values_by_county::stateId::" + stateId + "::field: " + field)

  //   const countyMap: Map<string, number> = new Map();

  //   // Populate the map
  //   this.data.forEach((countyData) => {
  //     const countyName = countyData.county_name;
  //     const value = this.valfromstring(stateId, countyName, field);

  //     if (value !== null) {
  //       // Set the string-number pair in the Map
  //       countyMap.set(countyName, value);
  //     }
  //   });

  //   if (orderByValue) {
  //     return new Map([...countyMap.entries()].sort((a, b) => b[1] - a[1]));
  //   } else {
  //     return countyMap;
  //   }

  // }

  // getCountyRank(stateId:string, selectedCountyName: string, selectedColumn: ColumnInfo) {
  //   const sortedCounties = this.values_by_county(stateId,selectedColumn.code, true);
  //   const rank = Array.from(sortedCounties.keys()).indexOf(selectedCountyName) + 1;
  //   return rank;
  // }
}
