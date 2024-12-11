import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  CountyData: a
    .model({
      state: a.string().required(),
      county_name: a.string().required(),
      population: a.integer().required(),
      pop_under_18_per: a.float().required(),
      medi_cal_e_under_21: a.integer().required(),
      bcba_d: a.integer().required(),
      bcba: a.integer().required(),
      area: a.float().required(),
    })
    .authorization((allow) => [allow.group('Admin'), allow.authenticated()]),

    
  ColumnData: a
    .model({
      code: a.string().required(),  // Type of `keyof CountyInfo` can't be directly translated in Amplify, so we use string.
      name: a.string().required(),
      formula: a.string().required(),
      description: a.string().required(),
      type: a.string().required(),
      format: a.string().required(),
    })
    .authorization((allow) => [allow.group('Admin'), allow.authenticated().to(['read'])]),

  RateData: a
    .model({
      payer: a.string().required(),
      network: a.string().required(),
      rate_005: a.float().required(),
      rate_010: a.float().required(),
      rate_025: a.float().required(),
      rate_050: a.float().required(),
      rate_075: a.float().required(),
      rate_090: a.float().required(),
      rate_095: a.float().required(),
    })
    .authorization((allow) => [allow.group('Admin'), allow.authenticated().to(['read'])]),

  CodeData: a
    .model({
      cpt_code: a.integer().required(),
      description: a.string().required(),
      purpose: a.string().required(),
      duration: a.string().required(),
    })
    .authorization((allow) => [allow.group('Admin'), allow.authenticated().to(['read'])]),

  Service: a
    .model({
      id: a.integer().required(),
      payer: a.string().required(),
      network: a.string().required(),
    })
    .authorization((allow) => [allow.group('Admin'), allow.authenticated().to(['read'])]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
