import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';


import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
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


    contentHeight = '50px'; // Начальное значение

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

    navigateTo(path: string) {
        this.router.navigate([path]);
    }
    constructor(
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
                    setTimeout(()=>{
                        this.subscription.unsubscribe();
                        this.subscription = this.tableBarsService
                            .open(this.tableBarTemplate || '', {
                                adaptive: true,
                            })
                            .subscribe();
                    }, 3001)


                    setTimeout(()=>{
                        this.scrollService.blockOverflow()
                    }, 250)

                })


            }
        });
    }

    login(): Observable<any> {
        return this.http.post(`${environment.baseUrl}/api/auth/login`, {});
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }


}
