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

  cnt_entities?: number;
  cnt_ein?: number;
  cnt_networks?: number;
  cnt_payors?: number;
  bcaba?: number;
  rbt?: number;
  avg_rate?: number;
  value?: number; // Placeholder for other methods.
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

