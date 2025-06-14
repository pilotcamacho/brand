import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({

  DataForRegion: a.customType({
    min: a.float(),
    q05: a.float(),
    q10: a.float(),
    q15: a.float(),
    q20: a.float(),
    q25: a.float(),
    q30: a.float(),
    q35: a.float(),
    q40: a.float(),
    q45: a.float(),
    q50: a.float(),
    q55: a.float(),
    q60: a.float(),
    q65: a.float(),
    q70: a.float(),
    q75: a.float(),
    q80: a.float(),
    q85: a.float(),
    q90: a.float(),
    q95: a.float(),
    max: a.float(),

    avg: a.float(),
    sum: a.integer(),
    cnt: a.integer()
  }),

  RegionData: a.customType({
    r: a.string(),  // Region name
    n: a.integer(), // Count of elements used
    d: a.ref("DataForRegion"),
  }),

  QueryData: a
    .model({
      // if variable == "rate" the code_tiny is used as part of variable.
      //   if code_tiny == -1 is all codes then variable = "rate"
      //   if code_tiny == 2 (or any number) concat with "rate" to form "rate#2" 
      //   (code_tiny is the last digit of the full code. Example: 2 for code 97152)
      variable: a.string().required(), // variable_code
      region: a.string().required(), // state_id or USA
      p_i36: a.string().required(),  // ZZ is all. There is a code for each payor.
      t_i36: a.string().required(),  // ZZ is all. There is a code for each network_template.
      taxonomy: a.string().required(),  // ZZ is all. There is a code for each taxonomy.
      bcba_bt: a.string().required(),  // Z is all. This is a "y" for being a bcba_bt taxonomy number or an "n" for not.
      d_read: a.date().required(), // This is the date in which the data was read (in case of rate is when was read from API)
      region_data: a.ref("RegionData").array()
    })
    .identifier(['variable', 'region', 'p_i36', 't_i36', 'taxonomy', 'bcba_bt', 'd_read'])
    .authorization((allow) => [allow.group('Admin'), allow.authenticated()]),
    // .authorization((allow) => [allow.publicApiKey(), allow.guest().to(["read"]), allow.group('Admin'), allow.owner(), allow.authenticated()])
    // .authorization((allow) => [allow.guest()])
    // .authorization((allow) => [allow.publicApiKey()])


  // CountyData: a
  //   .model({
  //     state: a.string().required(),
  //     county_name: a.string().required(),
  //     population: a.integer().required(),
  //     pop_under_18_per: a.float().required(),
  //     medi_cal_e_under_21: a.integer().required(),
  //     bcba_d: a.integer().required(),
  //     bcba: a.integer().required(),
  //     area: a.float().required(),
  //   })
  //   .authorization((allow) => [allow.group('Admin'), allow.authenticated()]),


  // ColumnData: a
  //   .model({
  //     code: a.string().required(),  // Type of `keyof CountyInfo` can't be directly translated in Amplify, so we use string.
  //     name: a.string().required(),
  //     formula: a.string().required(),
  //     description: a.string().required(),
  //     type: a.string().required(),
  //     format: a.string().required(),
  //   })
  //   .authorization((allow) => [allow.group('Admin'), allow.authenticated().to(['read'])]),

  // RateData: a
  //   .model({
  //     payer: a.string().required(),
  //     network: a.string().required(),
  //     rate_005: a.float().required(),
  //     rate_010: a.float().required(),
  //     rate_025: a.float().required(),
  //     rate_050: a.float().required(),
  //     rate_075: a.float().required(),
  //     rate_090: a.float().required(),
  //     rate_095: a.float().required(),
  //   })
  //   .authorization((allow) => [allow.group('Admin'), allow.authenticated().to(['read'])]),

  // CodeData: a
  //   .model({
  //     cpt_code: a.integer().required(),
  //     description: a.string().required(),
  //     purpose: a.string().required(),
  //     duration: a.string().required(),
  //   })
  //   .authorization((allow) => [allow.group('Admin'), allow.authenticated().to(['read'])]),

  // Service: a
  //   .model({
  //     id: a.integer().required(),
  //     payer: a.string().required(),
  //     network: a.string().required(),
  //   })
  //   .authorization((allow) => [allow.group('Admin'), allow.authenticated().to(['read'])]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    // defaultAuthorizationMode: 'apiKey',
  },
});
