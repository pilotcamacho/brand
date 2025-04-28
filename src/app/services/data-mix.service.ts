import { Injectable } from '@angular/core';
import { MapInput, RegionType } from '../components/map-component/map-input';
import { Indicator, INDICATORS } from './data-i';
import { DdbService } from './ddb.service';

@Injectable({
  providedIn: 'root'
})
export class DataMixService {

  indicators = INDICATORS;

  mapInputRegion: MapInput;
  mapInputPopulation: MapInput;
  mapInputCntEntities: MapInput;

  constructor(
    public dynamoDB: DdbService,
  ) {
    this.mapInputRegion = new MapInput({ type: RegionType.COUNTRY, name: 'NA', code: 'NA', codeFP: 'NA' }, 'NA', [], 'mono', '0');
    this.mapInputPopulation = new MapInput({ type: RegionType.COUNTRY, name: 'NA', code: 'NA', codeFP: 'NA' }, 'NA', [], 'mono', '0');
    this.mapInputCntEntities = new MapInput({ type: RegionType.COUNTRY, name: 'NA', code: 'NA', codeFP: 'NA' }, 'NA', [], 'mono', '0');
  }

  async getMapInput(regionType: RegionType, regionName: string, selectedColumn: Indicator,
    p_i36: string, t_i36: string, taxonomy: string, bcba_bt: string, code: string | undefined, paletteId: string,
    myRate: number | null, isPopulationChecked: boolean, isCntEntitiesChecked: boolean): Promise<MapInput> {

    // return this.dynamoDB.getMapInput(regionType, regionName, selectedColumn, p_i36, t_i36, taxonomy, bcba_bt, code, paletteId, myRate)

    return Promise.all([
      this.dynamoDB.getMapInput(regionType, regionName, selectedColumn, p_i36, t_i36, taxonomy, bcba_bt, code, paletteId, myRate),
      this.dynamoDB.getMapInput(regionType, regionName, this.indicators[12], 'ZZ', 'ZZ', 'ZZ', 'Z', '00000', paletteId, myRate),
      this.dynamoDB.getMapInput(regionType, regionName, this.indicators[3], 'ZZ', 'ZZ', 'ZZ', 'Z', '00000', paletteId, myRate)
    ]).then(([mi, populationInput, cntEntities]) => {
          // this.mapInputRegion = regionInput;
          this.mapInputPopulation = populationInput;
          this.mapInputCntEntities = cntEntities;
    
          // console.log("HomePage::updateInfo::if (this.isPopulationChecked)::mi: " + JSON.stringify(mi));
    
          // console.log("HomePage::updateInfo::if (this.isPopulationChecked)::this.mapInputPopulation: " + JSON.stringify(this.mapInputPopulation));
    
          if (isPopulationChecked || isCntEntitiesChecked) {
            // Create a Map for fast lookup of population values by subRegion
            const populationMap = isPopulationChecked ?
              new Map(
                this.mapInputPopulation.data.map(dp => [dp.subRegion, dp.value])
              ) :
              new Map(
                this.mapInputCntEntities.data.map(dp => [dp.subRegion, dp.value])
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
