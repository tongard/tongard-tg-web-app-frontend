import {enableProdMode} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';

import {AppComponent} from './app/app.component';
import {appConfig} from './app/app.config';
import {environment} from './environments/environment';
import * as Sentry from "@sentry/angular";

if (environment.production) {
    
    Sentry.init({
        dsn: environment.sentryURL,
        integrations: [
          // Registers and configures the Tracing integration,
          // which automatically instruments your application to monitor its
          // performance, including custom Angular routing instrumentation
          Sentry.browserTracingIntegration(),
          // Registers the Replay integration,
          // which automatically captures Session Replays
          Sentry.replayIntegration(),
        ],
      
        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for tracing.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,
      
        // Set `tracePropagationTargets` to control for which URLs trace propagation should be enabled
        tracePropagationTargets: [ environment.traceURL],
      
        // Capture Replay for 10% of all sessions,
        // plus for 100% of sessions with an error
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
      });
      enableProdMode();
}



bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
