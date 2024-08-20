import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';


import { catchError, Observable, retryWhen, Subject, Subscription, switchMap, takeUntil, throwError, timer } from 'rxjs';
import { environment } from '../environments/environment';
import { CommonModule } from '@angular/common';
import { GlobalService } from './services/global.serice';
import { TAIGA_MODULES } from './taiga-all-modules/taiga.module';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { TuiTableBarsService } from '@taiga-ui/addon-tablebars';
import { ScrollControlService } from './services/scroll.service';
import { TUI_IS_MOBILE } from '@taiga-ui/cdk';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateService } from '@ngx-translate/core';
import { TranslateConfigModule } from './translate-config.module';
import { postEvent, initHapticFeedback } from '@tma.js/sdk';
// import { SocketService } from './services/socket.service';
import * as Sentry from "@sentry/angular";
import { TokenService } from './token.service';
import { CustomSocketService } from './custom.socket.service';
export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}



@Component({
    standalone: true,
    selector: 'app',
    imports: [CommonModule, RouterOutlet, TAIGA_MODULES, HttpClientModule, TranslateConfigModule],
    templateUrl: './app.component.html',

    styleUrls: ['./app.component.less'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AppComponent {
    token: any = null;
    isAdmin: boolean = false;
    currentRoute: string = '/';
    user = null;
    private destroy$ = new Subject<void>();
    private destroyTableBar$ = new Subject<void>();
    isLoader:boolean = true;

    contentHeight = '50px'; 

    @ViewChild('tableBarTemplate')
    tableBarTemplate: PolymorpheusContent;

    subscription = new Subscription();


    ngAfterViewInit() {
        
        if (this.isMobile === true) {

            postEvent('web_app_expand');
            const haptic = initHapticFeedback()
            haptic.notificationOccurred('success');
        }



        this.tableBarsService.bar$.subscribe(() => {
            setTimeout(() => {
                const popupElement = this.renderer.selectRootElement('#popup', true);
                const innerPopupElement = popupElement.querySelector('div');
                if (innerPopupElement !== null) {
                    this.contentHeight = innerPopupElement.offsetHeight;
                    this.cdRef.markForCheck()
                    this.cdRef.detectChanges()
                }
            }, 350)

        })
        this.cdRef.markForCheck()
    }

    destroy() {
        this.destroyTableBar$.next();
    }
    

    ngOnInit(): void {
        this.router.events.pipe(
            takeUntil(this.destroy$)
        ).subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.currentRoute = event.urlAfterRedirects;
                this.cdRef.markForCheck()
            }
        });
    }

    navigateTo(path: string, isDestroyMenu = false) {
        this.router.navigate([path]);
        if(isDestroyMenu === true){
            this.destroy()
        }
    }
    constructor(
        trace: Sentry.TraceService,
        public translate: TranslateService,
        private readonly tableBarsService: TuiTableBarsService,
        private renderer: Renderer2,
        private http: HttpClient,
        private cdRef: ChangeDetectorRef,
        public globalService: GlobalService,
        private router: Router,
        private scrollService: ScrollControlService,
        @Inject(TUI_IS_MOBILE) readonly isMobile: boolean

    ) {

        translate.addLangs(['en', 'ru']);
        translate.setDefaultLang('en');

        const browserLang: any = translate.getBrowserLang();
        globalService.setLng(browserLang.match(/en|ru/) ? browserLang : 'en')
        translate.use(globalService.getLng());
        let stateMenu:boolean = false;
        this.globalService.getMenuState().subscribe(state =>{
            console.log(stateMenu, state)
            if(state === true && stateMenu === false){
                console.log('show table bar')
                this.tableBarsService
                .open(this.tableBarTemplate || '', {
                    adaptive: true,
                }).pipe(takeUntil(this.destroyTableBar$))
                .subscribe();
                this.cdRef.markForCheck()
                this.cdRef.detectChanges()
                stateMenu = true;
            } else if(state === false){
                console.log('hide')
                this.destroyTableBar$.next();
                stateMenu = false;
            }
        })
        this.login().pipe(
            takeUntil(this.destroy$)
        ).subscribe(e => {
            if (e.token) {
                this.token = e.token;

                this.globalService.setAdmin(e.type === 'admin' ? true : false)
                this.globalService.setToken(this.token)

                this.globalService.refreshUser().pipe(
                    takeUntil(this.destroy$)
                ).subscribe(u => {
                   
                    const lng = u.tgUser?.language_code ? u.tgUser?.language_code : browserLang.match(/en|ru/) ? browserLang : 'en';

                    globalService.setLng(lng)   
                    translate.use(globalService.getLng());
                    this.user = u;
                    this.cdRef.markForCheck()
                    this.cdRef.detectChanges()
                    this.navigateTo('/splash')
                    this.subscription.unsubscribe();
           
                      
                    setTimeout(()=>{
                            this.isLoader = false;
                            this.globalService.showBar()                        
                    }, 2850)


                    setTimeout(()=>{
                        this.scrollService.blockOverflow()
                    }, 250)

                })


            }
        });
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

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
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


}
