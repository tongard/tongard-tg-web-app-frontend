import type { ApplicationConfig } from '@angular/core';
import { APP_INITIALIZER, ErrorHandler, importProvidersFrom, } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';
import {
    TUI_SANITIZER,

    TuiRootModule,
} from '@taiga-ui/core';

import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { TAIGA_MODULES } from './taiga-all-modules/taiga.module';
import { environment } from '../environments/environment';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import * as Sentry from "@sentry/angular";

const config: SocketIoConfig = { url: environment.baseUrl, options: {} };

export const appConfig: ApplicationConfig = {
    providers: [
        {
            provide: ErrorHandler,
            useValue: Sentry.createErrorHandler(),
        },
        {
            provide: Sentry.TraceService,
            deps: [Router],
        },
        {
            provide: APP_INITIALIZER,
            useFactory: () => () => { },
            deps: [Sentry.TraceService],
            multi: true,
        },
        provideAnimations(),
        provideRouter(routes),
        provideClientHydration(),
        provideHttpClient(withInterceptorsFromDi(), withFetch()),
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        },

        importProvidersFrom(
            TuiRootModule,
            TAIGA_MODULES,
            HttpClientModule,
            SocketIoModule.forRoot(config)
        ),
        {
            provide: TUI_SANITIZER,
            useClass: NgDompurifySanitizer,
        },
    ],
};
