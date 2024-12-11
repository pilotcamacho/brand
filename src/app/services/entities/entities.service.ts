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

  updateCountiesData(region: Region): ColumnInfoByRegion[] {
    const columData: ColumnData = {
      code: "entities_count_by_county",
      name: "Entities count by county",
      formula: "#",
      description: "Entities count by county: description.",
      type: "",
      format: "0"
    }
    // const filteredData: DataRowByCounty[] = this.data.filter((item) => item.state_name === region.name).map((item) => {
    //   return new DataRowByCounty({state: item.state_id, county_name: item.county_name, entities_count_by_county: item.cnt_entities})
    // })


    let filteredData: DataRowByCounty[];

    if (region.name === 'USA') {
      // Group by state_name and sum cnt_entities
      const groupedByState = this.data.reduce((acc, item) => {
        if (!acc[item.state_name]) {
          acc[item.state_name] = new DataRowByCounty({
            state: item.state_id,
            county_name: item.state_name, // Use state name as "county_name" for this case
            entities_count_by_county: 0,
          });
        }
        acc[item.state_name].entities_count_by_county =
          (acc[item.state_name].entities_count_by_county ?? 0) + item.cnt_entities;
        return acc;
      }, {} as Record<string, DataRowByCounty>);

      // Convert the grouped object into an array
      filteredData = Object.values(groupedByState);
    } else {
      // Regular filtering
      filteredData = this.data
        .filter((item) => item.state_name === region.name)
        .map((item) => {
          return new DataRowByCounty({
            state: item.state_id,
            county_name: item.county_name,
            entities_count_by_county: item.cnt_entities,
          });
        });
    }

    return [new ColumnInfoByRegion(region, columData, filteredData)]
  }
}
