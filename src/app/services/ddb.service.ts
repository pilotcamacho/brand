import { Injectable } from '@angular/core';

import { generateClient } from 'aws-amplify/data';
import { type Schema } from '../../../amplify/data/resource'

const client = generateClient<Schema>();



@Injectable({
  providedIn: 'root'
})
export class DdbService {

  constructor() {
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

    const inputQuery = { variable: (code_tiny > -1 ? (variable + '#' +code_tiny) : variable), region: region, p_i36: p_i36, n_i36: n_i36 }
    const { errors, data: qData } = await client.models.QueryData.get(inputQuery)

    console.log(`DdbService::go()::qData|errors: ${JSON.stringify(qData)}, ${errors}`)

    return qData;
  }
}
