export interface Indicator {
  indicatorCode: string;
  indicatorName: string;
  indicatorDescription: string;
  indicatorGroup: 'medicare' | 'rates' | 'commercial' | 'general';
  aggregation: string;
  selected: boolean;
  format: string;
  pScale: number;
  pSymbol: string;
}

export const INDICATORS: Indicator[] =
  [
    { indicatorCode: "rate", indicatorName: "Rates", indicatorDescription: "Rate", indicatorGroup: "rates", aggregation: "q50", selected: false, pScale: 0, pSymbol: "", format: "0.00" },

    { indicatorCode: "medicaid_enrolled_lbas", indicatorName: "Geographic Distribution of  LBAs", indicatorDescription: "Medicaid Enrolled LBAs", indicatorGroup: "medicare", aggregation: "cnt", selected: false, pScale: 0, pSymbol: "", format: "0" },
    { indicatorCode: "medicaid_pop_total", indicatorName: "Medicaid Enrolled Children with Autism", indicatorDescription: "Geographic Distribution of LBA.", indicatorGroup: "medicare", aggregation: "cnt", selected: false, pScale: 0, pSymbol: "", format: "0" },

    { indicatorCode: "cnt_entities", indicatorName: "Entities count by county", indicatorDescription: "Entities count by county: description.", indicatorGroup: "commercial", aggregation: "cnt", selected: false, pScale: 0, pSymbol: "", format: "0" },
    { indicatorCode: "cnt_ein", indicatorName: "Ein count by county", indicatorDescription: "Ein count by county: description.", indicatorGroup: "commercial", aggregation: "cnt", selected: false, pScale: 0, pSymbol: "", format: "0" },
    { indicatorCode: "cnt_networks", indicatorName: "Neworks count by county", indicatorDescription: "Networks count by county: description.", indicatorGroup: "commercial", aggregation: "cnt", selected: false, pScale: 0, pSymbol: "", format: "0" },
    { indicatorCode: "cnt_payors", indicatorName: "Payors count by county", indicatorDescription: "Payors count by county: description.", indicatorGroup: "commercial", aggregation: "cnt", selected: false, pScale: 0, pSymbol: "", format: "0" },
    { indicatorCode: "bcba_d", indicatorName: "bcba_d count by county", indicatorDescription: "bcba_d count by county: description.", indicatorGroup: "commercial", aggregation: "q50", selected: false, pScale: 0, pSymbol: "", format: "0" },
    { indicatorCode: "bcba", indicatorName: "bcba count by county", indicatorDescription: "bcba count by county: description.", indicatorGroup: "commercial", aggregation: "q50", selected: false, pScale: 0, pSymbol: "", format: "0" },
    { indicatorCode: "bcaba", indicatorName: "bcaba count by county", indicatorDescription: "bcaba count by county: description.", indicatorGroup: "commercial", aggregation: "q50", selected: false, pScale: 0, pSymbol: "", format: "0" },
    { indicatorCode: "rbt", indicatorName: "rbt count by county", indicatorDescription: "rbt count by county: description.", indicatorGroup: "commercial", aggregation: "q50", selected: false, pScale: 0, pSymbol: "", format: "0" },

    { indicatorCode: "population", indicatorName: "population", indicatorDescription: "population", indicatorGroup: "general", aggregation: "cnt", selected: false, pScale: 0, pSymbol: "", format: "0" },
    { indicatorCode: "area", indicatorName: "Area (km2)", indicatorDescription: "Area of land in km2.", indicatorGroup: "general", aggregation: "cnt", selected: false, pScale: 0, pSymbol: "", format: "0" },
    { indicatorCode: "pop_density", indicatorName: "Population Density", indicatorDescription: "Number of inhabitants per km2.", indicatorGroup: "general", aggregation: "cnt", selected: false, pScale: 0, pSymbol: "", format: "0.0" },
  ]

// List of codes
export const CODES = [
  { id: '00000', name: 'All' },
  { id: '97151', name: '97151' },
  { id: '97152', name: '97152' },
  { id: '97153', name: '97153' },
  { id: '97154', name: '97154' },
  { id: '97155', name: '97155' },
  { id: '97156', name: '97156' },
  { id: '97157', name: '97157' },
  { id: '97158', name: '97158' },
];

// List of payors
export const PAYORS = [
  { id: 'ZZ', name: 'ALL' },
  { id: '37', name: 'Aetna' },
  { id: '2G', name: 'Alliant Health Plans' },
  { id: '3C', name: 'Allina Health' },
  { id: '24', name: 'AllWays Health Partners' },
  { id: '28', name: 'Ambetter' },
  { id: '2R', name: 'Americas PPO' },
  { id: '4E', name: 'Amerihealth Caritas Next' },
  { id: '3U', name: 'AmeriHealth Insurance Company of New Jersey' },
  { id: '3A', name: 'Anthem' },
  { id: '0M', name: 'Arkansas Blue Cross and Blue Shield' },
  { id: '4H', name: 'Aspirus Health Plan' },
  { id: '48', name: 'Asuris Northwest Health' },
  { id: '0T', name: 'AultCare Insurance Company' },
  { id: '4V', name: 'Avera Health Plans Inc' },
  { id: '4Q', name: 'AvMed' },
  { id: '25', name: 'Baylor Scott and White Health Plan' },
  { id: '1C', name: 'BCBS Puerto Rico (Triple S)' },
  { id: '38', name: 'Beacon Health Options' },
  { id: '3V', name: 'Blue Card' },
  { id: '0R', name: 'Blue Cross and Blue Shield of Illinois' },
  { id: '2D', name: 'Blue Cross and Blue Shield of Kansas' },
  { id: '1G', name: 'Blue Cross and Blue Shield of Kansas City' },
  { id: '1N', name: 'Blue Cross and Blue Shield of Montana' },
  { id: '2U', name: 'Blue Cross and Blue Shield of Nebraska' },
  { id: '01', name: 'Blue Cross and Blue Shield of New Mexico' },
  { id: '3I', name: 'Blue Cross and Blue Shield of North Carolina' },
  { id: '2K', name: 'Blue Cross and Blue Shield of Oklahoma' },
  { id: '3S', name: 'Blue Cross and Blue Shield of Texas' },
  { id: '0F', name: 'Blue Cross and Blue Shield of Vermont' },
  { id: '2V', name: 'Blue Cross and Blue Shield of Wyoming' },
  { id: '3W', name: 'Blue Cross Blue Shield Louisiana' },
  { id: '44', name: 'Blue Cross Blue Shield of Alabama' },
  { id: '3B', name: 'Blue Cross Blue Shield of Arizona' },
  { id: '2C', name: 'Blue Cross Blue Shield of Massachusetts' },
  { id: '0B', name: 'Blue Cross Blue Shield of Michigan' },
  { id: '43', name: 'Blue Cross Blue Shield of Minnesota' },
  { id: '16', name: 'Blue Cross Blue Shield of Mississippi' },
  { id: '20', name: 'Blue Cross Blue Shield of North Dakota' },
  { id: '1T', name: 'Blue Cross Blue Shield of Rhode Island' },
  { id: '3T', name: 'Blue Cross of Idaho' },
  { id: '1Q', name: 'Blue Shield of California' },
  { id: '3M', name: 'BlueCross BlueShield of South Carolina' },
  { id: '1L', name: 'BlueCross BlueShield of Tennessee' },
  { id: '3D', name: 'BridgeSpan' },
  { id: '31', name: 'Capital BlueCross' },
  { id: '2W', name: 'Capital District Physicians Health Plan' },
  { id: '4J', name: 'Capital Health Plan Inc' },
  { id: '0W', name: 'CareFirst BlueCross BlueShield' },
  { id: '4A', name: 'Caresource' },
  { id: '4P', name: 'Centivo' },
  { id: '1J', name: 'Christus' },
  { id: '1W', name: 'Cigna Corporation' },
  { id: '1V', name: 'Common Ground Healthcare Cooperative' },
  { id: '2O', name: 'Community Health Choice' },
  { id: '3X', name: 'Community Health Options' },
  { id: '1H', name: 'CommunityCare' },
  { id: '2H', name: 'ComPsych' },
  { id: '2E', name: 'Coventry Health Plan of Florida' },
  { id: '3K', name: 'Cox Health Systems' },
  { id: '17', name: 'Curative' },
  { id: '0J', name: 'DakotaCare' },
  { id: '1O', name: 'Dean Health Plan' },
  { id: '40', name: 'Denver Health Medical Plan' },
  { id: '1I', name: 'EHN' },
  { id: '4O', name: 'Emblem Health' },
  { id: '2N', name: 'EMI Health' },
  { id: '32', name: 'Encore' },
  { id: '0S', name: 'Excellus BlueCross BlueShield' },
  { id: '33', name: 'Fallon Health' },
  { id: '0A', name: 'Fidelis Care' },
  { id: '0G', name: 'First Health' },
  { id: '2S', name: 'Florida Blue' },
  { id: '2M', name: 'Geisinger Health Plan' },
  { id: '1E', name: 'Group Health Cooperative of South Central Wisconsin' },
  { id: '0Z', name: 'HAP' },
  { id: '06', name: 'Harvard Pilgrim Healthcare' },
  { id: '14', name: 'Hawaii Medical Assurance Association' },
  { id: '2L', name: 'Hawaii Medical Service Association' },
  { id: '0V', name: 'Health Advantage HMO Partners' },
  { id: '1S', name: 'Health Alliance' },
  { id: '10', name: 'Health Net' },
  { id: '0K', name: 'Health New England Inc' },
  { id: '4L', name: 'Health Payment Systems' },
  { id: '4U', name: 'Health Plan of Nevada' },
  { id: '47', name: 'Health2Business' },
  { id: '08', name: 'Healthcare Highways' },
  { id: '4I', name: 'Healthfirst' },
  { id: '49', name: 'HealthPartners' },
  { id: '0L', name: 'HealthPlan Services' },
  { id: '2Y', name: 'Healthsmart' },
  { id: '2Z', name: 'Henry Ford Health System' },
  { id: '36', name: 'Highmark Blue Cross Blue Shield Delaware' },
  { id: '1Y', name: 'Highmark Blue Cross Blue Shield Pennsylvania' },
  { id: '4C', name: 'Highmark Blue Cross Blue Shield West Virginia' },
  { id: '3Q', name: 'Highmark Blue Cross Blue Shield Western New York' },
  { id: '13', name: 'Highmark Blue Shield of Northeastern New York' },
  { id: '1Z', name: 'Highmark Blue Shield Pennsylvania' },
  { id: '21', name: 'HMA' },
  { id: '4G', name: 'Hometown Health Plan' },
  { id: '41', name: 'Horizon Blue Cross Blue Shield of New Jersey' },
  { id: '0Q', name: 'Humana' },
  { id: '1A', name: 'Imagine360' },
  { id: '12', name: 'Independence BCBS' },
  { id: '02', name: 'Independent Health' },
  { id: '4R', name: 'Innovation Health Plan' },
  { id: '09', name: 'Kaiser Foundation Health Plan' },
  { id: '2X', name: 'Lifewise' },
  { id: '1D', name: 'Magellan Health' },
  { id: '1X', name: 'MagnaCare' },
  { id: '35', name: 'McLaren' },
  { id: '0U', name: 'Medcost' },
  { id: '1F', name: 'Medica' },
  { id: '3E', name: 'Medical Mutual of Ohio' },
  { id: '19', name: 'MercyCare' },
  { id: '1K', name: 'Meritain Health' },
  { id: '3J', name: 'MHN' },
  { id: '2B', name: 'Midlands Choice' },
  { id: '18', name: 'Moda Health' },
  { id: '07', name: 'Molina Healthcare' },
  { id: '3F', name: 'MultiPlan' },
  { id: '2I', name: 'MVP Health Care' },
  { id: '0E', name: 'Neighborhood Health Plan of Rhode Island' },
  { id: '3P', name: 'Network Health' },
  { id: '3Y', name: 'Ohio PPO Connect' },
  { id: '3Z', name: 'Optima Health' },
  { id: '26', name: 'Optum' },
  { id: '1U', name: 'Oscar Insurance Corporation' },
  { id: '34', name: 'Oxford Health Plan' },
  { id: '4F', name: 'Pacificare' },
  { id: '3R', name: 'PacificSource Health Plans' },
  { id: '04', name: 'Paramount Insurance Company' },
  { id: '2T', name: 'Physicians Health Plan' },
  { id: '4S', name: 'Physicians Health Plan of Northern Indiana' },
  { id: '4M', name: 'Piedmont Health Plan' },
  { id: '2P', name: 'Point32Health' },
  { id: '0P', name: 'Preferred One' },
  { id: '4T', name: 'Premera Blue Cross' },
  { id: '42', name: 'Presbyterian Health Plan' },
  { id: '3O', name: 'Prime Health Services' },
  { id: '1M', name: 'Priority Health' },
  { id: '3H', name: 'Prominence Health Plan' },
  { id: '3L', name: 'ProviDRs Care' },
  { id: '11', name: 'Qualchoice' },
  { id: '4N', name: 'Quartz' },
  { id: '4W', name: 'Regence BlueCross BlueShield of Oregon' },
  { id: '30', name: 'Regence BlueCross BlueShield of Utah' },
  { id: '29', name: 'Regence BlueShield of Idaho' },
  { id: '4D', name: 'Regence BlueShield of Washington' },
  { id: '2Q', name: 'Rocky Mountain Health Plan' },
  { id: '39', name: 'Sagamore Health Network' },
  { id: '0D', name: 'Sana Benefits' },
  { id: '2J', name: 'Sanford Health Group' },
  { id: '1P', name: 'Security Health Plan of Wisconsin' },
  { id: '15', name: 'SelectHealth' },
  { id: '22', name: 'SIHO Insurance Services' },
  { id: '1B', name: 'Summa Care' },
  { id: '0X', name: 'Sutter Health Plus' },
  { id: '0O', name: 'Texas Health Aetna' },
  { id: '3N', name: 'The Alliance' },
  { id: '0H', name: 'The Health Plan' },
  { id: '05', name: 'Trilogy' },
  { id: '23', name: 'Truli' },
  { id: '0I', name: 'Tufts Health Plan' },
  { id: '0C', name: 'UCare' },
  { id: '0Y', name: 'UHA' },
  { id: '2F', name: 'UnitedHealthcare' },
  { id: '46', name: 'Univera Healthcare' },
  { id: '45', name: 'University of Utah Health Plans' },
  { id: '3G', name: 'UPMC Health Plan' },
  { id: '4K', name: 'Valley Health Plan' },
  { id: '4B', name: 'Wellmark Blue Cross and Blue Shield of Iowa' },
  { id: '27', name: 'Wellmark Blue Cross and Blue Shield of South Dakota' },
  { id: '1R', name: 'WellSense Health Plan' },
  { id: '2A', name: 'Western Health Advantage' },
  { id: '03', name: 'WPS Health Plan' },
  { id: '0N', name: 'Yale University Health Plan' }
];

