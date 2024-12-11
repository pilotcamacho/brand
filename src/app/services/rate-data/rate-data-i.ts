export interface RateData {
    payer: string;
    network: string;
    rate_005: number;
    rate_010: number;
    rate_025: number;
    rate_050: number;
    rate_075: number;
    rate_090: number;
    rate_095: number;
}

export interface CodeData {
    cpt_code: number,
    description: string,
    purpose: string,
    duration: string
}

export interface Service {
    id: number;
    payer: string;
    network: string;
  }
  
