import type { ApplicationConfig } from '@angular/core';
import { importProvidersFrom, } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import {
    TUI_SANITIZER,

    TuiRootModule,
} from '@taiga-ui/core';

import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { TAIGA_MODULES } from './taiga-all-modules/taiga.module';


export const appConfig: ApplicationConfig = {
    providers: [
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
            HttpClientModule
        ),
        {
            provide: TUI_SANITIZER,
            useClass: NgDompurifySanitizer,
        },
    ],
};
