import { CountyData } from "./county-data-i";

/**
 * This represents each row, including original data and derived data
 */
export class DataRowByCounty {
  state: string;
  county_name: string;
  population: number;
  pop_under_18_per: number;
  medicaid_pop_total: number;
  medicaid_enrolled_lbas: number;
  actual_bcba: number;
  area: number;
  ratio_real_providers: number;

  // medi_cal_e_under_21?: number;
  bcba_d?: number;
  bcba?: number;

  cnt_entities?: number;
  bcaba?: number;
  rbt?: number;

  value?: number; // This is a value place holder for other methods to use.

  // [key: string]: number; // Allow dynamic properties

  constructor(
    countyData: CountyData
  ) {
    this.state = countyData.state;
    this.county_name = countyData.county_name;
    this.population = countyData.population ?? 0;
    this.pop_under_18_per = countyData.pop_under_18_per ?? 0;
    this.medicaid_pop_total = countyData.medicaid_pop_total ?? 0;
    this.medicaid_enrolled_lbas = countyData.medicaid_enrolled_lbas ?? 0;
    this.actual_bcba = countyData.actual_bcba ?? 0;
    this.area = countyData.area ?? 0;
    this.ratio_real_providers = countyData.ratio_real_providers ?? 0;
    this.cnt_entities = countyData.cnt_entities ?? 0;

    // this.medi_cal_e_under_21 = countyData.medi_cal_e_under_21;
    this.bcba_d = countyData.bcba_d;
    this.bcba = countyData.bcba;
    this.bcaba = countyData.bcaba;
    this.rbt = countyData.rbt;
  }

  get empty(): number { return 0 }


  get pop_density(): number { return this.population / this.area }

  get pop_under_18_tot(): number { return this.population * this.pop_under_18_per }

  get medicaid_pop_under_18(): number { return this.medicaid_pop_total * this.pop_under_18_per }
  get tot_medicaid(): number { return this.medicaid_pop_under_18 / 36 }
  get tot_combined(): number { return this.pop_under_18_tot / 36 }
  get needed_bcba_combined(): number { return this.tot_combined / 12 }
  get needed_bcba_medicaid(): number { return this.tot_medicaid / 12 }
  get needed_commercial(): number { return this.needed_bcba_combined - this.needed_bcba_medicaid }

  get adequate(): number { return this.needed_bcba_medicaid - this.medicaid_enrolled_lbas }
  get per_medicaid(): number { return this.adequate / this.needed_bcba_medicaid }

  get adequate_combined(): number { return this.actual_bcba - this.needed_bcba_medicaid }
  get per_total(): number { return this.needed_bcba_combined / this.adequate_combined }
  get tot_census_medicaid(): number { return this.pop_under_18_tot - this.medicaid_pop_under_18 }
  get adequate_commercial(): number { return this.actual_bcba - this.needed_commercial }
  get per_comercial(): number { return this.adequate_commercial / this.needed_commercial }

  get adequate_per(): number { return (this.medicaid_enrolled_lbas - this.needed_bcba_medicaid) / this.needed_bcba_medicaid }
  get adequate_combined_per(): number { return (this.actual_bcba - this.needed_bcba_medicaid) / this.needed_bcba_medicaid }
  get adequate_commercial_per(): number { return (this.actual_bcba - this.needed_commercial) / this.needed_commercial }


}
