import { Injectable } from '@angular/core';

import { generateClient, SelectionSet } from 'aws-amplify/data';
import { type Schema } from '../../../amplify/data/resource'
import { DataPoint, MapInput, Region, RegionType } from '../components/map-component/map-input';
import { StatesService } from './states/states.service';
import { Indicator } from './data-i';
import { RdsDataSource } from 'aws-cdk-lib/aws-appsync';


type QueryData = Schema['QueryData']['type'];

const client = generateClient<Schema>();

const queryDataSelectionSet = [
  'variable',
  'region',
  'p_i36', 't_i36',
  'taxonomy',
  'd_read',
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

  async go(variable: string, region: string, p_i36: string, t_i36: string, taxonomy: string, code_tiny: number):
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
    console.log(`DdbService::go() ${variable}, ${region}, ${p_i36}, ${t_i36}, ${taxonomy}, ${code_tiny} `)
    // const { errors, data: qData } = await client.models.QueryData.create({
    //   variable: 'rate#2',
    //   region: 'CO',
    //   p_i36: '1W',
    //   n_i36: 'D9',
    //   // code_tiny: 1,
    //   region_data: [{subRegionName: 'Adams2', dataForSubRegion: {q10: 0.1, q50: 0.5}}]
    // })

    const inputQuery = {
      variable: (code_tiny > -1 ? (variable + '#' + code_tiny) : variable),
      region: region, p_i36: p_i36, t_i36: t_i36, taxonomy: taxonomy, d_read: '2025-02-01'
    }
    console.log(`DdbService::go()::inputQuery:  ${JSON.stringify(inputQuery)}`)


    const { errors, data: qData } = await client.models.QueryData.get(inputQuery)

    console.log(`DdbService::go()::qData|errors: ${JSON.stringify(qData)}, ${errors}`)

    return qData;
  }

  async getMapInput(regionType: RegionType, regionName: string, selectedColumn: Indicator,
    p_i36: string, t_i36: string, taxonomy: string, code: string | undefined): Promise<MapInput> {
    console.log(`Ddb::getMapInput::regionName | regionType::${regionName}, ${regionType}`);

    const region: Region = this.getRegion(regionType, regionName);

    const qData = await this.go(selectedColumn.indicatorCode, region.code, p_i36, t_i36, taxonomy, this.getRightMostDigit(code))
    console.log(`Ddb::getMapInput::qData: ${JSON.stringify(qData)}`)

    // Create the data array
    const data: DataPoint[] = []

    if (qData) {
      const aggregationKey = selectedColumn.aggregation === 'q50' ? 'q50'
        : selectedColumn.aggregation === 'cnt' ? 'cnt'
          : 'avg';

      console.log(`Ddb::getMapInput::aggregationKey: ${aggregationKey}`)


      qData.region_data.forEach((rd: { n: any; d: Record<string, any> }) => {
        const subRegion = region.type === RegionType.COUNTRY
          ? this.statesSrv.getStateDetailsByCode(rd.n)?.state_name ?? ''
          : rd.n;

          console.log(`Ddb::getMapInput::rd.n: ${rd.n}`)
          console.log(`Ddb::getMapInput::subRegion: ${subRegion}`)

        if (subRegion !== '') {
          data.push({
            subRegion, value: rd.d[aggregationKey],
            quantiles: {
              q10: rd.d['q10'],
              q25: rd.d['q25'],
              q50: rd.d['q50'],
              q75: rd.d['q75'],
              q90: rd.d['q90'],
              change: rd.d['q50'] !== 0
                ? parseFloat(((rd.d['q75'] - rd.d['q25']) / rd.d['q50']).toFixed(2))
                : null // Avoid division by zero
            }
          })
        }
        ;
      });
    }


    console.log(`DataService::getMapInput::data::${JSON.stringify(data)}`);

    // const dataNoMinus = data.filter(item => (item.value > 0 || selectedColumn.indicatorCode !== 'rate'))
    // console.log(`DataService::getMapInput::dataNoMinus::${JSON.stringify(dataNoMinus)}`);

    // Create the MapInput object
    const mapInput = new MapInput(
      region,
      selectedColumn.indicatorName,
      data,
      selectedColumn.format !== '0.00%' && false, // Force red-green color
      selectedColumn.format
    );

    console.log(`DataService::getMapInput::mapInput::${JSON.stringify(mapInput)}`);
    return mapInput;
  }

  private getRegion(regionType: RegionType, regionName: string): Region {
    console.log(`DdbService::getRegion::regionType|regionName: ${regionType}, ${regionName}`);
    if (regionType === RegionType.STATE) {
      console.log(`DdbService::getRegion::if::regionType|regionName: ${regionType}, ${regionName}`);
      const stateDetails = this.statesSrv.getStateDetailsByCode(regionName);
      if (!stateDetails) {
        throw new Error('State not found');
      }
      return {
        type: regionType,
        name: stateDetails.state_name,
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

  getRightMostDigit(str: string | undefined): number {
    if (!str) return -1; // Return -1 if str is undefined or an empty string

    if (str === '00000') return -1; // Return -1 if str is undefined or an empty string

    const lastChar = str.trim().slice(-1); // Get the last character
    const digit = parseInt(lastChar, 10); // Convert to integer

    return isNaN(digit) ? -1 : digit; // Return the digit or null if not a number
  }



}
