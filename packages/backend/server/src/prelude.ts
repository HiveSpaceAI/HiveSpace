import 'reflect-metadata';

import { cpSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { config } from 'dotenv';
import { omit } from 'lodash-es';

import {
  applyEnvToConfig,
  getDefaultHiveSpaceConfig,
} from './fundamentals/config';

const configDir = join(fileURLToPath(import.meta.url), '../config');
async function loadRemote(remoteDir: string, file: string) {
  const filePath = join(configDir, file);
  if (configDir !== remoteDir) {
    cpSync(join(remoteDir, file), filePath, {
      force: true,
    });
  }

  await import(pathToFileURL(filePath).href);
}

async function load() {
  const HiveSpace_CONFIG_PATH = process.env.HiveSpace_CONFIG_PATH ?? configDir;
  // Initializing HiveSpace config
  //
  // 1. load dotenv file to `process.env`
  // load `.env` under pwd
  config();
  // load `.env` under user config folder
  config({
    path: join(HiveSpace_CONFIG_PATH, '.env'),
  });

  // 2. generate HiveSpace default config and assign to `globalThis.HiveSpace`
  globalThis.HiveSpace = getDefaultHiveSpaceConfig();

  // TODO(@forehalo):
  //   Modules may contribute to ENV_MAP, figure out a good way to involve them instead of hardcoding in `./config/HiveSpace.env`
  // 3. load env => config map to `globalThis.HiveSpace.ENV_MAP
  await loadRemote(HiveSpace_CONFIG_PATH, 'HiveSpace.env.js');

  // 4. load `config/HiveSpace` to patch custom configs
  await loadRemote(HiveSpace_CONFIG_PATH, 'HiveSpace.js');

  // 5. load `config/HiveSpace.self` to patch custom configs
  // This is the file only take effect in [HiveSpace Cloud]
  if (!HiveSpace.isSelfhosted) {
    await loadRemote(HiveSpace_CONFIG_PATH, 'HiveSpace.self.js');
  }

  // 6. apply `process.env` map overriding to `globalThis.HiveSpace`
  applyEnvToConfig(globalThis.HiveSpace);

  if (HiveSpace.node.dev) {
    console.log(
      'HiveSpace Config:',
      JSON.stringify(omit(globalThis.HiveSpace, 'ENV_MAP'), null, 2)
    );
  }
}

await load();
