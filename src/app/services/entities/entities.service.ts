import { Injectable } from '@angular/core';
import { Region } from 'src/app/components/map-component/map-input';
import { ColumnInfoByRegion } from '../county-data/column-info';
import { EntitiesCount, ENTITIES_COUNT } from './entities-data';
import { ColumnData } from '../county-data/county-data-i';
import { DataRowByCounty } from '../county-data/county-info';

@Injectable({
  providedIn: 'root'
})
export class EntitiesService {

  private data: EntitiesCount[] = ENTITIES_COUNT;

  // private columnsInfo!: ColumnInfoByRegion[];

  constructor() { }

  getStateInfo(region: Region): ColumnInfoByRegion[] {
    return this.updateCountiesData(region);
    // return this.columnsInfo
  }


  generateData(
    region: Region,
    code: keyof DataRowByCounty,
    name: string,
    formula: string,
    description: string,
    type: string,
    format: string
  ): ColumnInfoByRegion {
    // V2
    const columData: ColumnData = {
      code: code,
      name: name,
      formula: formula,
      description: description,
      type: type,
      format: format,
    };

    // Runtime check to ensure code is a key of EntitiesCount
    if (!(code in (this.data[0] as EntitiesCount))) {
      throw new Error(`The code "${code}" is not a key of EntitiesCount.`);
    }
    const ecCode = code as keyof EntitiesCount;

    let filteredData: DataRowByCounty[];

    if (region.name === 'USA') {
      // Group by state_name and sum the dynamic property
      const groupedByState = this.data.reduce((acc, item) => {
        if (!acc[item.state_name]) {
          acc[item.state_name] = new DataRowByCounty({
            state: item.state_id,
            county_name: item.state_name, // Use state name as "county_name" for this case
            value: 0 as any, // Initialize the dynamic property
          });
        }
        acc[item.state_name].value =
          ((acc[item.state_name].value as number) ?? 0) + (item[ecCode] as number ?? 0);
        return acc;
      }, {} as Record<string, DataRowByCounty>);


      const updatedJson = this.renameFieldInJson(groupedByState, "value", code);

      // console.log('EntitiesService::generateData::updatedJson: ' + JSON.stringify(updatedJson))


      // Convert the grouped object into an array
      filteredData = Object.values(updatedJson);
    } else {
      // Regular filtering
      filteredData = this.data
        .filter((item: EntitiesCount) => item.state_name === region.name)
        .map((item) => {
          return new DataRowByCounty({
            state: item.state_id,
            county_name: item.county_name,
            [code]: item[ecCode] as number, // Use the dynamic property
          });
        });
    }
    // console.log('EntitiesService::generateData::columData: ' + JSON.stringify(columData))
    // console.log('EntitiesService::generateData::filteredData: ' + JSON.stringify(filteredData))


    return new ColumnInfoByRegion('commercial', region, columData, filteredData);
  }





  updateCountiesData(region: Region): ColumnInfoByRegion[] {

    // // V1
    // const columData: ColumnData = {
    //   code: "entities_count_by_county",
    //   name: "Entities count by county",
    //   formula: "#",
    //   description: "Entities count by county: description.",
    //   type: "",
    //   format: "0"
    // }
    // // const filteredData: DataRowByCounty[] = this.data.filter((item) => item.state_name === region.name).map((item) => {
    // //   return new DataRowByCounty({state: item.state_id, county_name: item.county_name, entities_count_by_county: item.cnt_entities})
    // // })


    // let filteredData: DataRowByCounty[];

    // if (region.name === 'USA') {
    //   // Group by state_name and sum cnt_entities
    //   const groupedByState = this.data.reduce((acc, item) => {
    //     if (!acc[item.state_name]) {
    //       acc[item.state_name] = new DataRowByCounty({
    //         state: item.state_id,
    //         county_name: item.state_name, // Use state name as "county_name" for this case
    //         entities_count_by_county: 0,
    //       });
    //     }
    //     acc[item.state_name].entities_count_by_county =
    //       (acc[item.state_name].entities_count_by_county ?? 0) + item.cnt_entities;
    //     return acc;
    //   }, {} as Record<string, DataRowByCounty>);

    //   // Convert the grouped object into an array
    //   filteredData = Object.values(groupedByState);
    // } else {
    //   // Regular filtering
    //   filteredData = this.data
    //     .filter((item) => item.state_name === region.name)
    //     .map((item) => {
    //       return new DataRowByCounty({
    //         state: item.state_id,
    //         county_name: item.county_name,
    //         entities_count_by_county: item.cnt_entities,
    //       });
    //     });
    // }

    return [
      // new ColumnInfoByRegion('commercial', region, columData, filteredData),

      this.generateData(region, 'cnt_entities', "Entities count by county", "#", "Entities count by county: description.", "", "0"),
      this.generateData(region, 'bcba_d', "bcba_d count by county", "#", "bcba_d count by county: description.", "", "0"),
      this.generateData(region, 'bcba', "bcba count by county", "#", "bcba count by county: description.", "", "0"),
      this.generateData(region, 'bcaba', "bcaba count by county", "#", "bcaba count by county: description.", "", "0"),
      this.generateData(region, 'rbt', "rbt count by county", "#", "rbt count by county: description.", "", "0"),
    ]
  }

  renameFieldInJson(
    json: Record<string, any>,
    oldFieldName: string,
    newFieldName: string
  ): Record<string, any> {
    const updatedJson: Record<string, any> = {};

    for (const key in json) {
      if (json.hasOwnProperty(key)) {
        const item = json[key];

        // Rename the field if it exists
        if (oldFieldName in item) {
          const value = item[oldFieldName];
          delete item[oldFieldName];
          item[newFieldName] = value;
        }

        updatedJson[key] = item;
      }
    }

    return updatedJson;
  }
}
