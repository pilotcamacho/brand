import { Injectable } from '@angular/core';
import { MapInput, Region, RegionType } from '../components/map-component/map-input';
import { Indicator, INDICATORS } from './data-i';
import { DdbService } from './ddb.service';
import { Indicators } from '../components/score-table/score-indicators-i';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class DataMixService {

  indicators = INDICATORS;

  indicatorGroups: Indicators = {
    region: 'USA',
    subRegion: '',
    columns: [
      // {
      //   col_title: 'Commercial', rows: [
      //     { code: 'rate', title: 'Rates', value: 134, pColor: 75 },
      //     { code: 'cnt_payers', title: 'Payers count', value: 24, pColor: 65 },
      //     { code: 'cnt_networks', title: 'Neworks count', value: 23, pColor: 45 },
      //     { code: 'cnt_entities', title: 'Entities count', value: 9, pColor: 25 }
      //   ]
      // },
      // {
      //   col_title: 'Medicaid', rows: [
      //     { code: 'medicaid_rate', title: 'Medicaid Rates', value: 134, pColor: 75 },
      //     { code: 'medicaid_enrolled_lbas', title: 'Geographic Distribution of  LBAs', value: 24, pColor: 65 },
      //     { code: 'medicaid_pop_total', title: 'Medicaid Enrolled Children with Autism', value: 23, pColor: 45 },
      //   ]
      // },
      // {
      //   col_title: 'General', rows: [
      //     { code: 'population', title: 'Population', value: 134, pColor: 75 },
      //     { code: '10', title: 'Payers count', value: 24, pColor: 65 },
      //     { code: '11', title: 'Neworks count', value: 23, pColor: 45 },
      //     { code: '12', title: 'Entities count', value: 9, pColor: 25 }
      //   ]
      // }
    ]
  }

  currentData: any
  currentRegionType!: RegionType
  currentRegionName!: string

  currentDataRatio: any

  constructor(
    public dynamoDB: DdbService,
    // public utilsSrv: UtilsService
  ) {
    this.updateCurrentDataRatio(RegionType.COUNTRY, 'USA', 'ZZ', 'ZZ', 'ZZ', 'Z', '00000', 'mono', 0, false, false)
  }

  async updateIndicatorGroupData(): Promise<any> {
    console.log("DataMixService::updateIndicatorGroupData::")
    return this.indicatorGroups;
  }

  getIndicatorGroups(region: Region, subRegion: Region): Indicators {
    const getValuePair = (code: string) =>
      this.currentDataRatio[code]?.valuesFromSubRegionName(subRegion.name) || [null, null];

    const rateV = getValuePair('rate');
    const cnt_payersV = getValuePair('cnt_payers');
    const cnt_networksV = getValuePair('cnt_networks');
    const cnt_entitiesV = getValuePair('cnt_entities');
    const bcba_d = getValuePair('bcba_d');
    const bcba = getValuePair('bcba');
    const bcaba = getValuePair('bcaba');
    const rbt = getValuePair('rbt');

    const medicaid_rateV = getValuePair('medicaid_rate');
    const medicaid_enrolled_lbasV = getValuePair('medicaid_enrolled_lbas');
    const medicaid_pop_totalV = getValuePair('medicaid_pop_total');

    const medicaid_enrollmentV = getValuePair('medicaid_enrollment');
    const chip_enrollmentV = getValuePair('chip_enrollment');
    const medicaid_total_chipV = getValuePair('medicaid_total_chip');
    const medicaid_child_chipV = getValuePair('medicaid_child_chip');

    const populationV = getValuePair('population');
    const pop_under_18V = getValuePair('pop_under_18');
    const areaV = getValuePair('area');
    const hhiV = getValuePair('hhi');
    const phiV = getValuePair('phi');

    return {
      region: region.name,
      subRegion: subRegion.name,
      columns: [
        {
          col_title: 'Commercial',
          rows: [
            { code: 'rate', title: 'Rates', value: rateV['value'], pColor: rateV['pColor'], format: rateV['format'], help: rateV['reference'] },
            { code: 'cnt_payers', title: 'Payers count', value: cnt_payersV['value'], pColor: cnt_payersV['pColor'], format: cnt_payersV['format'], help: cnt_payersV['reference'] },
            { code: 'cnt_networks', title: 'Networks count', value: cnt_networksV['value'], pColor: cnt_networksV['pColor'], format: cnt_networksV['format'], help: cnt_networksV['reference'] },
            { code: 'cnt_entities', title: 'Entities count', value: cnt_entitiesV['value'], pColor: cnt_entitiesV['pColor'], format: cnt_entitiesV['format'], help: cnt_entitiesV['reference'] },

            { code: 'bcba_d', title: 'bcba_d count', value: bcba_d['value'], pColor: bcba_d['pColor'], format: bcba_d['format'], help: bcba_d['reference'] },
            { code: 'bcba', title: 'bcba count', value: bcba['value'], pColor: bcba['pColor'], format: bcba['format'], help: bcba['reference'] },
            { code: 'bcaba', title: 'bcaba count', value: bcaba['value'], pColor: bcaba['pColor'], format: bcaba['format'], help: bcaba['reference'] },
            { code: 'rbt', title: 'rbt count', value: rbt['value'], pColor: rbt['pColor'], format: rbt['format'], help: rbt['reference'] },
          ]
        },
        {
          col_title: 'Medicaid',
          rows: [
            { code: 'medicaid_rate', title: 'Medicaid Rates', value: medicaid_rateV['value'], pColor: medicaid_rateV['pColor'], format: medicaid_rateV['format'], help: medicaid_rateV['reference'] },
            { code: 'medicaid_enrolled_lbas', title: 'Geographic Distribution of  LBAs', value: medicaid_enrolled_lbasV['value'], pColor: medicaid_enrolled_lbasV['pColor'], format: medicaid_enrolled_lbasV['format'], help: medicaid_enrolled_lbasV['reference'] },
            { code: 'medicaid_pop_total', title: 'Medicaid Enrolled Children with Autism', value: medicaid_pop_totalV['value'], pColor: medicaid_pop_totalV['pColor'], format: medicaid_pop_totalV['format'], help: medicaid_pop_totalV['reference'] },

            { code: 'medicaid_enrollment', title: 'Medicaid Enrollment', value: medicaid_enrollmentV['value'], pColor: medicaid_enrollmentV['pColor'], format: medicaid_enrollmentV['format'], help: medicaid_enrollmentV['reference'] },
            { code: 'chip_enrollment', title: 'CHIP Enrollment', value: chip_enrollmentV['value'], pColor: chip_enrollmentV['pColor'], format: chip_enrollmentV['format'], help: chip_enrollmentV['reference'] },
            { code: 'medicaid_total_chip', title: 'Total Medicaid and CHIP Enrollment', value: medicaid_total_chipV['value'], pColor: medicaid_total_chipV['pColor'], format: medicaid_total_chipV['format'], help: medicaid_total_chipV['reference'] },
            { code: 'medicaid_child_chip', title: 'Child Enrollment (Medicaid Child + CHIP Enrollment)', value: medicaid_child_chipV['value'], pColor: medicaid_child_chipV['pColor'], format: medicaid_child_chipV['format'], help: medicaid_child_chipV['reference'] },
          ]
        },
        {
          col_title: 'General',
          rows: [
            { code: 'population', title: 'Population', value: populationV['value'], pColor: populationV['pColor'], format: populationV['format'], help: populationV['reference'] },
            { code: 'pop_under_18', title: 'Population under 18', value: pop_under_18V['value'], pColor: pop_under_18V['pColor'], format: pop_under_18V['format'], help: pop_under_18V['reference'] },
            { code: 'area', title: 'Area (km2)', value: areaV['value'], pColor: areaV['pColor'], format: areaV['format'], help: areaV['reference'] },
            { code: 'hhi', title: 'Household Income', value: hhiV['value'], pColor: hhiV['pColor'], format: hhiV['format'], help: hhiV['reference'] },
            { code: 'phi', title: 'Private Health Insurance', value: phiV['value'], pColor: phiV['pColor'], format: phiV['format'], help: phiV['reference'] },
          ]
        }
      ]
    };

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
    this.currentRegionType = regionType
    console.log("DataMixService::updateCurrentData::this.currentRegionType: ", this.currentRegionType)
    this.currentRegionName = regionName
    console.log("DataMixService::updateCurrentData::this.regionName: ", this.currentRegionName)
  }

  async updateCurrentDataRatio(regionType: RegionType, regionName: string,
    p_i36: string, t_i36: string, taxonomy: string, bcba_bt: string, code: string | undefined, paletteId: string,
    myRate: number | null, isPopulationChecked: boolean, isCntEntitiesChecked: boolean) {

    return this.updateCurrentData(regionType, regionName, p_i36, t_i36, taxonomy, bcba_bt, code, paletteId, myRate)
      .then(() => {
        this.currentDataRatio = Object.fromEntries(
          Object.entries(this.currentData as { [key: string]: MapInput }).map(([key, value]: [string, MapInput]) => {
            const transformed = this.getMapInputR(value, isPopulationChecked, isCntEntitiesChecked);
            return [key, transformed];
          })
        );
      });
  }

  getMapInputR(mapInput: MapInput, isPopulationChecked: boolean, isCntEntitiesChecked: boolean): MapInput {
    const mi: MapInput = new MapInput(mapInput.region, mapInput.title, mapInput.data, mapInput.paletteId, mapInput.format, mapInput.isPercentage)
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

      mi.format = UtilsService.formatForDataset(mi.data.map(dp => { return dp.value }), mi.format)
      // console.log("HomePage::updateInfo:mi.format: " + mi.format)
    }

    return mi
  }

  async getMapInputRatio(regionType: RegionType, regionName: string, selectedColumn: Indicator,
    p_i36: string, t_i36: string, taxonomy: string, bcba_bt: string, code: string | undefined, paletteId: string,
    myRate: number | null, isPopulationChecked: boolean, isCntEntitiesChecked: boolean): Promise<MapInput> {

    return this.updateCurrentDataRatio(
      regionType, regionName, p_i36, t_i36, taxonomy, bcba_bt, code, paletteId, myRate, isPopulationChecked, isCntEntitiesChecked)
      .then(() => {
        // console.log("HomePage::getMapInputRatio::this.currentDataRatio: " + JSON.stringify(this.currentDataRatio));
        return this.currentDataRatio[selectedColumn.indicatorCode]
      })
  }

  getCommercialRate(region: Region, event: any): number | null {
    // console.log("DataMixService::getCommercialRate::region: " + JSON.stringify(region));
    // console.log("DataMixService::getCommercialRate::event: " + JSON.stringify(event));
    // console.log("DataMixService::getCommercialRate::currentData: " + JSON.stringify(this.currentData));

    const rate = this.currentData.rate.data.find((d: { subRegion: string; }) => d.subRegion === event.name);
    const value = rate ? rate.value : null;
    console.log("DataMixService::getCommercialRate::value: " + JSON.stringify(value));

    return value;
  }

  getMedicadidRate(region: Region, event: any): number | null {
    // console.log("DataMixService::getMedicadidRate::region: " + JSON.stringify(region));
    // console.log("DataMixService::getMedicadidRate::event: " + JSON.stringify(event));
    // console.log("DataMixService::getMedicadidRate::currentData: " + JSON.stringify(this.currentData));

    const medicaid_rate = this.currentData.medicaid_rate.data.find((d: { subRegion: string; }) => d.subRegion === event.name);
    const value = medicaid_rate ? medicaid_rate.value : null;
    console.log("DataMixService::getMedicadidRate::value: " + JSON.stringify(value));

    return value;
  }




}
