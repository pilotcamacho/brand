import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({

  DataForRegion: a.customType({
    q10: a.float(),
    q25: a.float(),
    q50: a.float(),
    q75: a.float(),
    q90: a.float(),
    avg: a.float(),
    sum: a.integer(),
    cnt: a.integer()
  }),

  RegionData: a.customType({
    n: a.string(),
    d: a.ref("DataForRegion"),
  }),


  QueryData: a
    .model({
      variable: a.string().required(), // variable_code (if rate the code_tiny: -1 is all (last digit of the full code): "rate_3"; in case -1: "rate")
      region: a.string().required(), // state_id or USA
      p_i36: a.string().required(),  // ZZ is all
      n_i36: a.string().required(),  // ZZ is all
      // code_tiny: a.integer().required(), // -1 is all (last digit of the full code)
      region_data: a.ref("RegionData").array()
      // value: a.float().required(),
      // aggregation_method: a.integer().required(),
      // quntiles: a.float().required(),
    })
    .identifier(['variable', 'region', 'p_i36', 'n_i36'])
    .authorization((allow) => [allow.group('Admin'), allow.authenticated()]),

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
  },
});
