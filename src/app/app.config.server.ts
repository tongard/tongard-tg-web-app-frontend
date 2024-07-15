import type {ApplicationConfig} from '@angular/core';
import {mergeApplicationConfig} from '@angular/core';
import {provideServerRendering} from '@angular/platform-server';
import {UNIVERSAL_PROVIDERS} from '@ng-web-apis/universal';

import {appConfig} from './app.config';
import { GlobalService } from './services/global.serice';

const serverConfig: ApplicationConfig = {
    providers: [provideServerRendering(), UNIVERSAL_PROVIDERS, GlobalService],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
