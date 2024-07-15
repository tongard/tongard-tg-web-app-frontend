import {
    APP_BASE_HREF,
    DOCUMENT,
    LocationStrategy,
    PathLocationStrategy,
} from '@angular/common';
import { inject, Provider } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UrlTree } from '@angular/router';
import { SESSION_STORAGE } from '@ng-web-apis/common';
import {
    TUI_DOC_TITLE,
    TUI_DOC_URL_STATE_HANDLER,
    tuiDocExampleOptionsProvider,

} from '@taiga-ui/addon-doc';
import {
    TUI_BASE_HREF,
    TUI_DIALOG_CLOSES_ON_BACK,
    TUI_IS_E2E,
    TUI_IS_PLAYWRIGHT,
    TUI_TAKE_ONLY_TRUSTED_EVENTS,

} from '@taiga-ui/cdk';
import {
    TUI_DROPDOWN_HOVER_DEFAULT_OPTIONS,
    TUI_DROPDOWN_HOVER_OPTIONS,
    TUI_HINT_DEFAULT_OPTIONS,
    TUI_HINT_OPTIONS,
    TUI_SANITIZER,
} from '@taiga-ui/core';
import { TuiLanguageName, tuiLanguageSwitcher } from '@taiga-ui/i18n';
import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';

import { of } from 'rxjs';


export const APP_PROVIDERS: Provider[] = [
    Title,

    {
        provide: APP_BASE_HREF,
        // @note: By default, on webcontainer.io will not be provided APP_BASE_HREF, we use fallback
        useFactory: () => inject(DOCUMENT).querySelector('base')?.href || '/',
    },
    {
        provide: TUI_IS_PLAYWRIGHT,
        useFactory: () => Boolean(inject(SESSION_STORAGE).getItem('playwright')),
    },
    {
        provide: TUI_SANITIZER,
        useClass: NgDompurifySanitizer,
    },
    {
        provide: LocationStrategy,
        useClass: PathLocationStrategy,
    },
    {
        provide: TUI_DOC_TITLE,
        useValue: 'Taiga UI: ',
    },
    {
        provide: TUI_HINT_OPTIONS,
        useFactory: () =>
            inject(TUI_IS_E2E)
                ? { ...TUI_HINT_DEFAULT_OPTIONS, showDelay: 0, hideDelay: 0 }
                : TUI_HINT_DEFAULT_OPTIONS,
    },
    {
        provide: TUI_DROPDOWN_HOVER_OPTIONS,
        useFactory: () =>
            inject(TUI_IS_E2E)
                ? { ...TUI_DROPDOWN_HOVER_DEFAULT_OPTIONS, showDelay: 0, hideDelay: 0 }
                : TUI_DROPDOWN_HOVER_DEFAULT_OPTIONS,
    },
    {
        provide: TUI_TAKE_ONLY_TRUSTED_EVENTS,
        useFactory: () => !inject(TUI_IS_E2E),
    },
    {
        provide: TUI_DIALOG_CLOSES_ON_BACK,
        useFactory: () => of(inject(TUI_IS_E2E)),
    },
    {
        provide: TUI_DOC_URL_STATE_HANDLER,
        deps: [TUI_BASE_HREF],
        useFactory: (baseHref: string) => (tree: UrlTree) =>
            String(tree).replace(baseHref, ''),
    },

    tuiDocExampleOptionsProvider({ fullsize: false }),

    tuiLanguageSwitcher(
        async (language: TuiLanguageName): Promise<unknown> =>
            import(
                `dist/i18n/esm2015/languages/${language}`
            ),
    ),
];
