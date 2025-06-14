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
    // .authorization((allow) => [allow.group('Admin'), allow.authenticated()]),
    // .authorization((allow) => [allow.publicApiKey(), allow.guest().to(["read"]), allow.group('Admin'), allow.owner(), allow.authenticated()])
    .authorization((allow) => [allow.guest()])
    // .authorization((allow) => [allow.publicApiKey()])

});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    // defaultAuthorizationMode: 'userPool',
    defaultAuthorizationMode: 'iam',
    // defaultAuthorizationMode: 'apiKey',
  },
});
