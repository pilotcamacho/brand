import { DataRowByCounty } from "./county-info";

// Define the interface for your objects
export interface CountyData {
  state: string;
  county_name: string;
  population?: number;
  pop_under_18_per?: number;
  medicaid_pop_total?: number; // medicaid_pop_total_nysoh, medi_cal_e_under_21
  medicaid_enrolled_lbas?: number;
  actual_bcba?: number;
  area?: number;

  bcba_d?: number;
  bcba?: number;

  ratio_real_providers?: number;

  entities_count_by_county?: number;
}


export interface ColumnData {
  code: keyof DataRowByCounty;
  name: string;
  formula: string;
  description: string;
  // min: number;
  // max: number;
  type: string
  format: string;
}

export interface ColumnRenameByState {
  state: string;
  code: keyof DataRowByCounty;
  name: string;
}

