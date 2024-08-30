import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiRoot } from '@taiga-ui/core';

import { ThemeService } from '@services/theme.service';
import { NavigationComponent } from './navigation/navigation.component';
import { CustomSocketService } from './custom.socket.service';
import { TokenService } from './token.service';
import { catchError, Observable, retryWhen, Subject, switchMap, takeUntil, throwError, timer } from 'rxjs';
import { environment } from '@environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { postEvent, initHapticFeedback } from '@tma.js/sdk';

@Component({
    standalone: true,
    selector: 'app-root',
    imports: [NavigationComponent, RouterModule, TuiRoot],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    protected themeService = inject(ThemeService);
    private destroy$ = new Subject<void>();

    ngAfterViewInit() {
 
            postEvent('web_app_expand');
            const haptic = initHapticFeedback()
            haptic.notificationOccurred('success');
    
    }
    constructor(
        private tokenService: TokenService,
        private socket: CustomSocketService,
        private http: HttpClient
    ) {

        this.login().pipe(
            takeUntil(this.destroy$)
        ).subscribe((e: any) => {
            if (e.token) {

                this.tokenService.setToken(e.token);

            }
        })
    }

    login(): Observable<any> {
        return this.http.post(`${environment.baseUrl}/api/auth/login`, {}).pipe(
            retryWhen(errors =>
                errors.pipe(
                    switchMap((error, index) => {
                        if (index < 3 && this.shouldRetry(error)) {
                            return timer(3000);
                        }
                        return throwError(error);
                    })
                )
            ),
            catchError(this.handleError)
        );
    }

    private shouldRetry(error: HttpErrorResponse): boolean {
        // Retry only for 502 errors
        return error.status === 502;
    }

    private handleError(error: HttpErrorResponse) {
        console.error('An error occurred:', error.message);
        // You can return a user-friendly error message here
        return throwError('Something went wrong; please try again later.');
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
