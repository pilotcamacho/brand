import { Injectable } from '@angular/core';
import { MapInput, Region, RegionType } from '../components/map-component/map-input';
import { Indicator, INDICATORS } from './data-i';
import { DdbService } from './ddb.service';
import { Indicators } from '../components/score-table/score-indicators-i';

@Injectable({
  providedIn: 'root'
})
export class DataMixService {

  indicators = INDICATORS;

  indicatorGroups: Indicators = {
    subRegion: 'USA',
    columns: [
      {
        col_title: 'Commercial', rows: [
          { code: 'rate', title: 'Rates', value: 134, pColor: 75 },
          { code: 'cnt_payers', title: 'Payers count', value: 24, pColor: 65 },
          { code: 'cnt_networks', title: 'Neworks count', value: 23, pColor: 45 },
          { code: 'cnt_entities', title: 'Entities count', value: 9, pColor: 25 }
        ]
      },
      {
        col_title: 'Medicaid', rows: [
          { code: 'medicaid_rate', title: 'Medicaid Rates', value: 134, pColor: 75 },
          { code: 'medicaid_enrolled_lbas', title: 'Geographic Distribution of  LBAs', value: 24, pColor: 65 },
          { code: 'medicaid_pop_total', title: 'Medicaid Enrolled Children with Autism', value: 23, pColor: 45 },
        ]
      },
      {
        col_title: 'General', rows: [
          { code: 'population', title: 'Population', value: 134, pColor: 75 },
          { code: '10', title: 'Payers count', value: 24, pColor: 65 },
          { code: '11', title: 'Neworks count', value: 23, pColor: 45 },
          { code: '12', title: 'Entities count', value: 9, pColor: 25 }
        ]
      }
    ]
  }

  currentData: any

  constructor(
    public dynamoDB: DdbService,
  ) {
    this.updateCurrentData(RegionType.COUNTRY, 'USA', 'ZZ', 'ZZ', 'ZZ', 'Z', '00000', 'mono', 0)
  }

  async updateIndicatorGroupData(): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 100)); // wait 500 ms
    return this.indicatorGroups;
  }

  getIndicatorGroups(subRegion: Region): Indicators {
    this.indicatorGroups.subRegion = subRegion.name
    return this.indicatorGroups;
  }

  async updateCurrentData(regionType: RegionType, regionName: string,
    p_i36: string, t_i36: string, taxonomy: string, bcba_bt: string, code: string | undefined, paletteId: string,
    myRate: number | null) {

    const myOutput = await Promise.all(
      this.indicators.map(async (indicator) => {
        const mapInput = await this.dynamoDB.getMapInput(
          regionType,
          regionName,
          indicator,
          p_i36,
          t_i36,
          taxonomy,
          bcba_bt,
          code,
          paletteId,
          myRate
        );
        return {
          indicatorCode: indicator.indicatorCode,
          mapInput,
        };
      })
    ).then(results =>
      results.reduce((acc, { indicatorCode, mapInput }) => {
        acc[indicatorCode] = mapInput;
        return acc;
      }, {} as Record<string, typeof results[number]["mapInput"]>)
    );

    this.currentData = myOutput
    console.log("DataMixService::updateCurrentData::this.currentData: ", this.currentData)
  }

  async getMapInput(regionType: RegionType, regionName: string, selectedColumn: Indicator,
    p_i36: string, t_i36: string, taxonomy: string, bcba_bt: string, code: string | undefined, paletteId: string,
    myRate: number | null, isPopulationChecked: boolean, isCntEntitiesChecked: boolean): Promise<MapInput> {

    return this.updateCurrentData(regionType, regionName, p_i36, t_i36, taxonomy, bcba_bt, code, paletteId, myRate)
      .then(() => {
        // this.mapInputRegion = regionInput;
        const mi: MapInput = this.currentData[selectedColumn.indicatorCode];
        const mapInputPopulation: MapInput = this.currentData['population'];
        const mapInputCntEntities: MapInput = this.currentData['cnt_entities'];

        // console.log("HomePage::updateInfo::if (this.isPopulationChecked)::mi: " + JSON.stringify(mi));

        // console.log("HomePage::updateInfo::if (this.isPopulationChecked)::this.mapInputPopulation: " + JSON.stringify(this.mapInputPopulation));

        if (isPopulationChecked || isCntEntitiesChecked) {
          // Create a Map for fast lookup of population values by subRegion
          const populationMap = isPopulationChecked ?
            new Map(
              mapInputPopulation.data.map(dp => [dp.subRegion, dp.value])
            ) :
            new Map(
              mapInputCntEntities.data.map(dp => [dp.subRegion, dp.value])
            )
            ;

          // console.log("HomePage::updateInfo::if (this.isPopulationChecked)::populationMap: " + JSON.stringify(populationMap));

          // Divide each value in mi.data by the corresponding population value
          mi.data = mi.data.map(dp => {
            const populationValue = populationMap.get(dp.subRegion);

            // Avoid division by zero or undefined population values
            const newValue = (populationValue && populationValue !== 0)
              ? dp.value / populationValue
              : 0;

            return {
              ...dp,
              value: newValue
            };
          });


          const maxValue = Math.max(...mi.data.map(dp => { return dp.value }));
          // console.log("HomePage::updateInfo::maxValue: " + maxValue)

          const inverse = 1 / maxValue;
          // console.log("HomePage::updateInfo::inverse: " + inverse)


          // If maxValue > 1, cap roundE10 at 1
          const roundE10 = Math.max(1, this.roundToExponent10(inverse));
          // console.log("HomePage::updateInfo::roundE10: " + roundE10)


          mi.format = this.getFormatFromRound(roundE10);
          // console.log("HomePage::updateInfo:mi.format: " + mi.format)
        }

        return mi
        // this.columns = [
        //   { name: this.mapInput?.region?.type === 'country' ? 'State' : 'County', prop: 'subRegion', sortable: true },
        //   { name: 'Q10', prop: 'quantiles.q10', sortable: true },
        //   { name: 'Q25', prop: 'quantiles.q25', sortable: true },
        //   { name: 'Q50', prop: 'quantiles.q50', sortable: true },
        //   { name: 'Q75', prop: 'quantiles.q75', sortable: true },
        //   { name: 'Q90', prop: 'quantiles.q90', sortable: true },
        //   { name: 'Change', prop: 'quantiles.change', sortable: true },
        //   { name: 'My rate', prop: 'quantiles.myRate', sortable: true }
        // ]
      })
  }

  roundToExponent10(value: number): number {
    // Get the power of 10 just greater or equal to value
    const power = Math.ceil(Math.log10(value));
    return Math.pow(10, power);
  }

  getFormatFromRound(roundE10: number): string {
    if (roundE10 <= 1) return '0'; // no decimals
    const decimalPlaces = Math.abs(Math.log10(roundE10)) + 1;
    return '0.' + '0'.repeat(decimalPlaces);
  }





}
