import type { ApplicationConfig } from '@angular/core';
import { APP_INITIALIZER, ErrorHandler, importProvidersFrom, } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import {provideAnimations} from '@angular/platform-browser/animations';


import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { TAIGA_MODULES } from './taiga-all-modules/taiga.module';
import { environment } from '../environments/environment';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import * as Sentry from "@sentry/angular";
import { CustomSocketService } from './custom.socket.service';
import {NG_EVENT_PLUGINS} from '@taiga-ui/event-plugins';


export const appConfig: ApplicationConfig = {
    providers: [
        NG_EVENT_PLUGINS,
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

        provideHttpClient(withInterceptorsFromDi(), withFetch()),
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        },

        importProvidersFrom(
            // TAIGA_MODULES,
            HttpClientModule,
            CustomSocketService
            // SocketIoModule.forRoot(config)
        ),
    ],
};
