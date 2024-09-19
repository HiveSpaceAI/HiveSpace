/// <reference types="./global.d.ts" />
import './prelude';

import { Logger } from '@nestjs/common';

import { createApp } from './app';

const app = await createApp();
const listeningHost = Wasper.deploy ? '0.0.0.0' : 'localhost';
await app.listen(Wasper.port, listeningHost);

const logger = new Logger('App');

logger.log(`Wasper Server is running in [${Wasper.type}] mode`);
logger.log(`Listening on http://${listeningHost}:${Wasper.port}`);
logger.log(`And the public server should be recognized as ${Wasper.baseUrl}`);
