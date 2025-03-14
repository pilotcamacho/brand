import { Injectable } from '@angular/core';
import { CountyDataSrvService } from './county-data/county-data-srv.service';
import { DataPoint, MapInput, Region, RegionType } from '../components/map-component/map-input';
import { ColumnData } from './county-data/county-data-i';
import { StatesService } from './states/states.service';
import { EntitiesService } from './entities/entities.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(
    private cds: CountyDataSrvService,
    private statesSrv: StatesService,
    private entitiesSrv: EntitiesService
  ) {}

  getAvailableColumnsByRegion(region: Region) {
    // Implement this method if needed
  }

  getMapInput(regionType: RegionType, regionName: string, selectedColumn: ColumnData, paletteId: string): MapInput {
    // console.log(`DataService::getMapInput::regionName::${regionName}`);

    // Define the region
    const region: Region = this.getRegion(regionType, regionName);
    const regionData = [...this.cds.getStateInfo(region), ...this.entitiesSrv.getStateInfo(region)];
    const filteredRegionData = regionData.filter(item => item.code === selectedColumn.code);

    // Define the title
    const title = filteredRegionData.length > 0 ? filteredRegionData[0].name : 'No data found';

    // Create the data array
    const data: DataPoint[] = filteredRegionData.length > 0
      ? filteredRegionData[0].countiesInfo.filter((item): item is DataPoint => typeof item.value === 'number')
      : [];

    const dataNoMinus = data.filter(item => (item.value > 0 || selectedColumn.code !== 'avg_rate'))
    // console.log(`DataService::getMapInput::data::${JSON.stringify(data)}`);
    // console.log(`DataService::getMapInput::dataNoMinus::${JSON.stringify(dataNoMinus)}`);

    // Create the MapInput object
    const mapInput = new MapInput(
      region,
      title,
      dataNoMinus,
      paletteId,
      selectedColumn.format
    );

    // console.log(`DataService::getMapInput::mapInput::${JSON.stringify(mapInput)}`);
    return mapInput;
  }

  private getRegion(regionType: RegionType, regionName: string): Region {
    if (regionType === RegionType.STATE) {
      const stateDetails = this.statesSrv.getStateDetailsByName(regionName);
      if (!stateDetails) {
        throw new Error('State not found');
      }
      return {
        type: regionType,
        name: regionName,
        code: stateDetails.state_code ?? '',
        codeFP: stateDetails.state_fp ?? '',
      };
    }

    // Default to country if not state
    return {
      type: RegionType.COUNTRY,
      name: 'USA',
      code: 'USA',
      codeFP: '',
    };
  }
}
