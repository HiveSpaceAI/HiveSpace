/* eslint-disable @typescript-eslint/no-non-null-assertion */
// Custom configurations for HiveSpace Cloud
// ====================================================================================
// Q: WHY THIS FILE EXISTS?
// A: HiveSpace deployment environment may have a lot of custom environment variables,
//    which are not suitable to be put in the `HiveSpace.ts` file.
//    For example, HiveSpace Cloud Clusters are deployed on Google Cloud Platform.
//    We need to enable the `gcloud` plugin to make sure the nodes working well,
//    but the default selfhost version may not require it.
//    So it's not a good idea to put such logic in the common `HiveSpace.ts` file.
//
//    ```
//    if (HiveSpace.deploy) {
//      HiveSpace.plugins.use('gcloud');
//    }
//    ```
// ====================================================================================
const env = process.env;

HiveSpace.metrics.enabled = !HiveSpace.node.test;

if (env.R2_OBJECT_STORAGE_ACCOUNT_ID) {
  HiveSpace.plugins.use('cloudflare-r2', {
    accountId: env.R2_OBJECT_STORAGE_ACCOUNT_ID,
    credentials: {
      accessKeyId: env.R2_OBJECT_STORAGE_ACCESS_KEY_ID!,
      secretAccessKey: env.R2_OBJECT_STORAGE_SECRET_ACCESS_KEY!,
    },
  });
  HiveSpace.storage.storages.avatar.provider = 'cloudflare-r2';
  HiveSpace.storage.storages.avatar.bucket = 'account-avatar';
  HiveSpace.storage.storages.avatar.publicLinkFactory = key =>
    `https://avatar.HiveSpaceassets.com/${key}`;

  HiveSpace.storage.storages.blob.provider = 'cloudflare-r2';
  HiveSpace.storage.storages.blob.bucket = `workspace-blobs-${
    HiveSpace.HiveSpace.canary ? 'canary' : 'prod'
  }`;

  HiveSpace.storage.storages.copilot.provider = 'cloudflare-r2';
  HiveSpace.storage.storages.copilot.bucket = `workspace-copilot-${
    HiveSpace.HiveSpace.canary ? 'canary' : 'prod'
  }`;
}

HiveSpace.plugins.use('copilot', {
  openai: {},
  fal: {},
});
HiveSpace.plugins.use('redis');
HiveSpace.plugins.use('payment', {
  stripe: {
    keys: {
      // fake the key to ensure the server generate full GraphQL Schema even env vars are not set
      APIKey: '1',
      webhookKey: '1',
    },
  },
});
HiveSpace.plugins.use('oauth');

if (HiveSpace.deploy) {
  HiveSpace.mailer = {
    service: 'gmail',
    auth: {
      user: env.MAILER_USER,
      pass: env.MAILER_PASSWORD,
    },
  };

  HiveSpace.plugins.use('gcloud');
}
