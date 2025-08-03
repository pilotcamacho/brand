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
  'bcba_bt',
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

  references: Record<string, { reference: string }> = {
    'default|Unknown': { reference: '' },
    'medicaid|Unknown': { reference: '' },
    'commercial|Unknown': { reference: '' }, // https://www.serifhealth.com/
    'general|Unknown': { reference: 'https://www.census.gov/' },

    'medicaid|AK': { reference: 'https://www.azahcccs.gov/PlansProviders/RatesAndBilling/FFS/ABARates.html' },
    'medicaid|AL': { reference: 'https://health.mil/Reference-Center/Publications/2024/04/15/ABA-Maximum-Allowed-Rates-Effective-May-1-2024' },
    'medicaid|AR': { reference: 'https://humanservices.arkansas.gov/wp-content/uploads/ABATHERAPY-fees.pdf' },
    'medicaid|AZ': { reference: 'https://www.azahcccs.gov/PlansProviders/RatesAndBilling/FFS/ABARates.html' },
    'medicaid|CA': { reference: 'https://www.in.gov/fssa/files/ABA-Reimbursement-Provider-Meeting-09.20.23.pdf' },
    'medicaid|CO': { reference: 'https://hcpf.colorado.gov/sites/hcpf/files/01_CO_Fee%20Schedule_Health%20First%20Colorado_01012025%20v1.2.pdf' },
    'medicaid|CT': { reference: 'https://www.ctdssmap.com/CTPortal/Portals/0/StaticContent/Publications/CMAP_Addendum_B_01012025_Changes.pdf' },
    'medicaid|DE': { reference: 'https://medicaidpublications.dhss.delaware.gov/docs/DesktopModules/Bring2mind/DMX/API/Entries/Download?Command=Core_Download&EntryId=1424&language=en-US&PortalId=0&TabId=94' },
    'medicaid|FL': { reference: 'https://ahca.myflorida.com/content/download/25137/file/Behavior%20Analysis%20Fee%20Schedule%20October%201,%202024.pdf' },
    'medicaid|GA': { reference: 'https://www.mmis.georgia.gov/portal/Portals/0/StaticContent/Public/ALL/FEE%20SCHEDULES/Maximum%20Allw%20Pymt%20Physician%20Fee%20Schedule%20-%20April%202025%2020250321165838.pdf' },
    'medicaid|HI': { reference: 'https://medquest.hawaii.gov/content/dam/formsanddocuments/plans-and-providers/Fee_Schedule_20250228.pdf' },
    'medicaid|IA': { reference: 'https://secureapp.dhs.state.ia.us/IMPA/Information/ViewDocument.aspx?viewdocument=497e2fa3-f199-4f95-bdad-461a28ff9d83' },
    'medicaid|ID': { reference: 'https://publicdocuments.dhw.idaho.gov/WebLink/Browse.aspx?id=32189&dbid=0&repo=PUBLIC-DOCUMENTS' },
    'medicaid|IL': { reference: 'https://hfs.illinois.gov/content/dam/soi/en/web/hfs/sitecollectiondocuments/01262022absfeeschedulerbtupdatefinal.xlsx' },
    'medicaid|IN': { reference: 'https://www.in.gov/medicaid/providers/files/bulletins/BT2023169.pdf?utm_source=chatgpt.com' },
    'medicaid|KS': { reference: 'https://portal.kmap-state-ks.us/PublicPage/ProviderPricing/FeeSchedules' },
    'medicaid|KY': { reference: 'https://www.chfs.ky.gov/agencies/dms/DMSFeeRateSchedules/Copy%20of%202024%20Behavioral%20Health%20%20Fee%20Schedule_04012024%20FINAL%20updated%20032724.pdf' },
    'medicaid|LA': { reference: 'https://www.lamedicaid.com/provweb1/fee_schedules/ABA_FS_Current.pdf' },
    'medicaid|MA': { reference: 'https://www.mass.gov/doc/rates-for-applied-behavior-analysis-effective-october-1-2024-0/download' },
    'medicaid|MD': { reference: 'https://maryland.optum.com/content/dam/ops-maryland/documents/provider/information/pbhs/fee-schedules-eff--7-1-24/FY2025-ABA-Fee-Schedule-Eff%20-7.1.2024.pdf' },
    'medicaid|ME': { reference: 'https://mainecare.maine.gov/Provider%20Fee%20Schedules/Rate%20Setting/Section%20065%20-%20Behavioral%20Health%20Services/Section%2065%20-%20Behavioral%20Health%20Services%202025.pdf' },
    'medicaid|MI': { reference: 'https://www.michigan.gov/mdhhs/-/media/Project/Websites/mdhhs/Keeping-Michigan-Healthy/BH-DD/Reporting-Requirements/BH_Comparison_Rate_Development_Report_SFY_2023.pdf' },
    'medicaid|MN': { reference: 'https://mn.gov/dhs/assets/mhcp-fee-schedule_tcm1053-294225.pdf' },
    'medicaid|MO': { reference: 'https://mydss.mo.gov/media/pdf/fy2023-comprehensive-rates-june-2022' },
    'medicaid|MS': { reference: 'https://medicaid.ms.gov/wp-content/uploads/2022/04/Autism-Spectrum-Disorder-ASD-Fee-Schedule-Print-Date-04-05-2022.pdf' },
    'medicaid|MT': { reference: 'https://medicaidprovider.mt.gov/docs/feeschedules/2024/ABAFeeSchedule07012024.pdf' },
    'medicaid|NC': { reference: 'https://www.alliancehealthplan.org/document-library/80817' },
    'medicaid|ND': { reference: 'https://www.hhs.nd.gov/sites/www/files/documents/2024-7-1-autism-fee-schedule.pdf' },
    'medicaid|NE': { reference: 'https://dhhs.ne.gov/Medicaid%20Practitioner%20Fee%20Schedules/Mental%20Health%20and%20Substance%20Use%20July%201,%202022%20-%20Revised%208.10.2022.pdf' },
    'medicaid|NH': { reference: 'https://www.nhmmis.nh.gov/portals/wps/wcm/connect/af3f2487-7ff8-4485-bef6-2eed2cc9ed76/2024+Medicaid+to+Schools+Fee+Schedule+as+of+07-01-2024.pdf?MOD=AJPERES&CVID=p4fiEWl' },
    'medicaid|NJ': { reference: 'https://www.njmmis.com/downloadDocuments/OperationalManual.pdf' },
    'medicaid|NM': { reference: 'https://www.hca.nm.gov/wp-content/uploads/FInal-LOD-53-Applied-Behavioral-Analysis-ABA-Fee-Schedule-Rates.pdf' },
    'medicaid|NV': { reference: 'https://dhcfp.nv.gov/uploadedFiles/dhcfpnvgov/content/Resources/Rates/PT%2085%20Fee%20Schedule%20042025.xlsx' },
    'medicaid|NY': { reference: 'https://www.emedny.org/ProviderManuals/ABA/PDFS/ABA_Fee_Schedule.xls' },
    'medicaid|OH': { reference: 'https://dam.assets.ohio.gov/image/upload/medicaid.ohio.gov/Stakeholders%2C%20Partners/LegalandContracts/Rules/DR-NonBIA/ERF188422.pdf' },
    'medicaid|OK': { reference: 'https://oklahoma.gov/content/dam/ok/en/okhca/documents/a0300/24259.docx' },
    'medicaid|OR': { reference: 'https://www.oregon.gov/oha/hsd/ohp/pages/fee-schedule.aspx?wp6426=se:%22Behavioral+%22' },
    'medicaid|PA': { reference: 'https://www.humanservices.state.pa.us/OUTPATIENTFEESCHEDULE/Search/Submit' },
    'medicaid|RI': { reference: 'https://eohhs.ri.gov/sites/g/files/xkgbur226/files/2024-08/APC%20Fee%20Schedule%2020240822.pdf' },
    'medicaid|SC': { reference: 'https://www.scdhhs.gov/sites/default/files/ASD%20Fee%20Schedule%20-%207.1.2024.pdf' },
    'medicaid|SD': { reference: 'https://dss.sd.gov/docs/medicaid/providers/feeschedules/Other_Services/Applied_Behavior_Analysis_SFY25.pdf' },
    'medicaid|TN': { reference: 'https://health.mil/Reference-Center/Publications/2024/04/15/ABA-Maximum-Allowed-Rates-Effective-May-1-2024' },
    'medicaid|TX': { reference: 'https://pfd.hhs.texas.gov/sites/default/files/documents/2022/02-01-2022-policy-fee-review-autism-services.pdf' },
    'medicaid|UT': { reference: 'https://medicaid-documents.dhhs.utah.gov/Documents/manuals/pdfs/Medicaid%20Information%20Bulletins/Traditional%20Medicaid%20Program/2021/July2021-MIB.pdf' },
    'medicaid|VA': { reference: 'https://www.dmas.virginia.gov/media/ggudgw1q/final-billing-sheet.pdf' },
    'medicaid|VT': { reference: 'https://dvha.vermont.gov/providers/codesfee-schedules/opps-fee-schedules/2025-opps-fee-schedule' },
    'medicaid|WA': { reference: 'https://www.hca.wa.gov/assets/billers-and-providers/aba-20240101.xlsx' },
    'medicaid|WI': { reference: 'https://www.forwardhealth.wi.gov/WIPortal/Subsystem/Publications/MaxFeeDownload.aspx#bhic' },
    'medicaid|WV': { reference: 'https://dhhr.wv.gov/bms/FEES/Pages/Applied-Behavior-Analysis.aspx' },
    'medicaid|WY': { reference: 'https://www.wyomingmedicaid.com/portal/fee-schedules' },

  };


  constructor(
    private statesSrv: StatesService,
  ) {
    console.log('DdbService::constructor()')
  }

  async go(variable: string, region: string, p_i36: string, t_i36: string, taxonomy: string, bcba_bt: string, code_tiny: number):
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
    // console.log(`DdbService::go() ${variable}, ${region}, ${p_i36}, ${t_i36}, ${taxonomy}, ${bcba_bt}, ${code_tiny} `)
    // const { errors, data: qData } = await client.models.QueryData.create({
    //   variable: 'rate#2',
    //   region: 'CO',
    //   p_i36: '1W',
    //   n_i36: 'D9',
    //   // code_tiny: 1,
    //   region_data: [{subRegionName: 'Adams2', dataForSubRegion: {q10: 0.1, q50: 0.5}}]
    // })

    const bcbaTaxonomies = new Set(['bcba_bt', '106S00000X', '103K00000X', '103K00000X_D', 'BCaBA']);

    if (bcbaTaxonomies.has(taxonomy)) {
      taxonomy = taxonomy === 'bcba_bt' ? 'ZZ' : taxonomy;
      bcba_bt = 'y';
    }


    const inputQuery = {
      variable: (code_tiny > -1 ? (variable + '#' + code_tiny) : variable),
      region: region, p_i36: p_i36, t_i36: t_i36, taxonomy: taxonomy, bcba_bt: bcba_bt, d_read: '2025-02-01'
    }

    console.log(`DdbService::go()::inputQuery:  ${JSON.stringify(inputQuery)}`)
    // if (inputQuery.variable === 'cnt_payers') {
    await this.sleep(Math.floor(Math.random() * 1000)); // delay of 1000 ms (1 second)
    const { errors, data: qData } = await client.models.QueryData.get(inputQuery)
    return qData;
    // }

    // console.log(`DdbService::go()::qData|errors: ${JSON.stringify(qData)}, ${errors}`)

    // return null;
  }

  async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getMapInput(regionType: RegionType, regionName: string, selectedColumn: Indicator,
    p_i36: string, t_i36: string, taxonomy: string, bcba_bt: string, code: string | undefined, paletteId: string,
    myRate: number | null): Promise<MapInput> {

    const p_i36_ = selectedColumn.byPayerNetwork ? p_i36 : 'ZZ'
    const t_i36_ = selectedColumn.byPayerNetwork ? t_i36 : 'ZZ'

    const taxonomy_ = selectedColumn.byTaxonomy ? taxonomy : 'ZZ'
    const bcba_bt_ = selectedColumn.byTaxonomy ? bcba_bt : 'Z'
    const code_ = selectedColumn.byTaxonomy ? code : '00000'

    return this.getSpecificMapInput(regionType, regionName, selectedColumn, p_i36_, t_i36_, taxonomy_, bcba_bt_, code_, paletteId, myRate)
  }

  async getSpecificMapInput(regionType: RegionType, regionName: string, selectedColumn: Indicator,
    p_i36: string, t_i36: string, taxonomy: string, bcba_bt: string, code: string | undefined, paletteId: string,
    myRate: number | null): Promise<MapInput> {
    // console.log(`Ddb::getMapInput::regionName | regionType::${regionName}, ${regionType}`);

    const region: Region = this.getRegion(regionType, regionName);

    const qData = await this.go(
      selectedColumn.indicatorCode,
      region.code,
      selectedColumn.payerNetworkFilter ? p_i36 : 'ZZ',
      selectedColumn.payerNetworkFilter ? t_i36 : 'ZZ',
      selectedColumn.payerNetworkFilter ? taxonomy: 'ZZ',
      selectedColumn.payerNetworkFilter ? bcba_bt: 'Z',
      selectedColumn.payerNetworkFilter ? this.getRightMostDigit(code) : -1
    )
    // console.log(`Ddb::getMapInput::qData: ${JSON.stringify(qData)}`)

    const reference = this.getReference(selectedColumn.indicatorGroup, region.code);

    // console.log(`Ddb::getMapInput::region.code: ${JSON.stringify(region.code)}`)
    // console.log(`Ddb::getMapInput::reference: ${JSON.stringify(reference)}`)

    // Create the data array
    const data: DataPoint[] = []

    if (qData) {
      const aggregationKey = selectedColumn.aggregation === 'q50' ? 'q50'
        : selectedColumn.aggregation === 'cnt' ? 'cnt'
          : 'avg';

      // console.log(`Ddb::getMapInput::aggregationKey: ${aggregationKey}`)


      qData.region_data.forEach((rd: { r: any; d: Record<string, any> }) => {
        const subRegion = region.type === RegionType.COUNTRY
          ? this.statesSrv.getStateDetailsByCode(rd.r)?.state_name ?? ''
          : rd.r;

        // console.log(`Ddb::getMapInput::rd.n: ${rd.r}`)
        // console.log(`Ddb::getMapInput::subRegion: ${subRegion}`)
        // console.log(`Ddb::getMapInput::myRate: ${myRate}`)

        if (subRegion !== '') {
          data.push({
            subRegion, value: rd.d[aggregationKey],
            quantiles: {
              min: rd.d['min'],
              q05: rd.d['q05'],
              q10: rd.d['q10'],
              q25: rd.d['q25'],
              q50: rd.d['q50'],
              q75: rd.d['q75'],
              q90: rd.d['q90'],
              q95: rd.d['q95'],
              max: rd.d['max'],
              avg: rd.d['avg'],
              change: rd.d['q50'] !== 0
                ? parseFloat(((rd.d['q75'] - rd.d['q25']) / rd.d['q50']).toFixed(2))
                : null, // Avoid division by zero
              myRate: (myRate == null || Number.isNaN(myRate)) ? null : (
                (myRate > rd.d['q95']) ? 95 : (
                  (myRate > rd.d['q90']) ? 90 : (
                    (myRate > rd.d['q85']) ? 85 : (
                      (myRate > rd.d['q80']) ? 80 : (
                        (myRate > rd.d['q75']) ? 75 : (
                          (myRate > rd.d['q70']) ? 70 : (
                            (myRate > rd.d['q65']) ? 65 : (
                              (myRate > rd.d['q60']) ? 60 : (
                                (myRate > rd.d['q55']) ? 55 : (
                                  (myRate > rd.d['q50']) ? 50 : (
                                    (myRate > rd.d['q45']) ? 45 : (
                                      (myRate > rd.d['q40']) ? 40 : (
                                        (myRate > rd.d['q35']) ? 35 : (
                                          (myRate > rd.d['q30']) ? 30 : (
                                            (myRate > rd.d['q25']) ? 25 : (
                                              (myRate > rd.d['q20']) ? 20 : (
                                                (myRate > rd.d['q15']) ? 15 : (
                                                  (myRate > rd.d['q10']) ? 10 : (
                                                    (myRate > rd.d['q05']) ? 5 : 0)))))))))))))))))))
            },
            reference: reference
          })
        }
        ;
      });
    }


    // console.log(`DataService::getMapInput::data::${JSON.stringify(data)}`);

    // const dataNoMinus = data.filter(item => (item.value > 0 || selectedColumn.indicatorCode !== 'rate'))
    // console.log(`DataService::getMapInput::dataNoMinus::${JSON.stringify(dataNoMinus)}`);

    // Create the MapInput object
    const mapInput = new MapInput(
      region,
      selectedColumn.indicatorName,
      data,
      paletteId,
      // selectedColumn.format
      false
    );

    // console.log(`DataService::getMapInput::mapInput::${JSON.stringify(mapInput)}`);
    return mapInput;
  }

  private getRegion(regionType: RegionType, regionName: string): Region {
    // console.log(`DdbService::getRegion::regionType|regionName: ${regionType}, ${regionName}`);
    if (regionType === RegionType.STATE) {
      // console.log(`DdbService::getRegion::if::regionType|regionName: ${regionType}, ${regionName}`);
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

  getReference(indicatorGroup: string, regionCode: string): string {
    const keyGC = `${indicatorGroup}|${regionCode}`;
    const keyGU = `${indicatorGroup}|Unknown`;
    const keyUC = `default|${regionCode}`;
    const keyUU = `default|Unknown`;
    const theReference = this.references[keyGC] ?? this.references[keyGU] ?? this.references[keyUC] ?? this.references[keyUU];
    return theReference.reference ?? '';
  }

  getRightMostDigit(str: string | undefined): number {
    if (!str) return -1; // Return -1 if str is undefined or an empty string

    if (str === '00000') return -1; // Return -1 if str is undefined or an empty string

    const lastChar = str.trim().slice(-1); // Get the last character
    const digit = parseInt(lastChar, 10); // Convert to integer

    return isNaN(digit) ? -1 : digit; // Return the digit or null if not a number
  }
}
