import { Injectable } from '@angular/core';

import { generateClient, SelectionSet } from 'aws-amplify/data';
import { type Schema } from '../../../amplify/data/resource'
import { DataPoint, MapInput, Region, RegionType } from '../components/map-component/map-input';
import { ColumnData, Variable } from './county-data/county-data-i';
import { StatesService } from './states/states.service';


type QueryData = Schema['QueryData']['type'];

const client = generateClient<Schema>();

const queryDataSelectionSet = [
  'variable',
  'region',
  'p_i36', 'n_i36',
  'region_data.n',
  'region_data.d.q10',
  'region_data.d.q25',
  'region_data.d.q50',
  'region_data.d.q75',
  'region_data.d.q90',
  'region_data.d.avg',
  'region_data.d.sum',
  'region_data.d.cnt',
] as const;
type QueryDataSelectionSet = SelectionSet<Schema['QueryData']['type'], typeof queryDataSelectionSet>;

@Injectable({
  providedIn: 'root'
})
export class DdbService {

  constructor(
    private statesSrv: StatesService,
  ) {
    console.log('DdbService::constructor()')
  }

  async go(variable: string, region: string, p_i36: string, n_i36: string, code_tiny: number):
    // Promise<
    //   {variable: string, region: string, p_i36: string, n_i36: string, 
    //     region_data: ({n: (string | null), d:({
    //       q10:(number |null),
    //       q25:(number |null),
    //       q50:(number |null),
    //       q75:(number |null),
    //       q90:(number |null),
    //       avg:(number |null),
    //       cnt:(number |null),
    //     } | null)} | null), createdAt: string, updatedAt: string}[] | null
    //   >  
    Promise<any> {
    console.log('DdbService::go()')
    // const { errors, data: qData } = await client.models.QueryData.create({
    //   variable: 'rate#2',
    //   region: 'CO',
    //   p_i36: '1W',
    //   n_i36: 'D9',
    //   // code_tiny: 1,
    //   region_data: [{subRegionName: 'Adams2', dataForSubRegion: {q10: 0.1, q50: 0.5}}]
    // })

    const inputQuery = { variable: (code_tiny > -1 ? (variable + '#' + code_tiny) : variable), region: region, p_i36: p_i36, n_i36: n_i36 }
    const { errors, data: qData } = await client.models.QueryData.get(inputQuery)

    console.log(`DdbService::go()::qData|errors: ${JSON.stringify(qData)}, ${errors}`)

    return qData;
  }

  getMapInput(regionType: RegionType, regionName: string, selectedColumn: Variable, p_i36: string, n_i36: string, code: string | undefined): MapInput {
    console.log(`DataService::getMapInput::regionName::${regionName}`);

    // Define the region
    const region: Region = this.getRegion(regionType, regionName);
    // const regionData = [...this.cds.getStateInfo(region), ...this.entitiesSrv.getStateInfo(region)];
    // const filteredRegionData = regionData.filter(item => item.code === selectedColumn.code);

    // Define the title
    // const title = filteredRegionData.length > 0 ? filteredRegionData[0].name : 'No data found';

    // Create the data array
    const data: DataPoint[] = []

    const dataNoMinus = data.filter(item => (item.value > 0 || selectedColumn.code !== 'avg_rate'))
    console.log(`DataService::getMapInput::data::${JSON.stringify(data)}`);
    console.log(`DataService::getMapInput::dataNoMinus::${JSON.stringify(dataNoMinus)}`);

    // Create the MapInput object
    const mapInput = new MapInput(
      region,
      'Título',
      dataNoMinus,
      selectedColumn.format !== '0.00%' && false, // Force red-green color
      selectedColumn.format
    );

    console.log(`DataService::getMapInput::mapInput::${JSON.stringify(mapInput)}`);
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
