import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, ViewEncapsulation } from '@angular/core';
import { Observable, Subject, BehaviorSubject, timer } from 'rxjs';
import { switchMap, map, startWith, takeWhile, takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TAIGA_MODULES } from '../../taiga-all-modules/taiga.module';
import { FarmService } from '../earn/services/farm.service';
import { TUI_IS_E2E } from '@taiga-ui/cdk';
import { GlobalService } from '../../services/global.serice';
import { ScrollControlService } from '../../services/scroll.service';

import { TranslateService } from '@ngx-translate/core';
import { TranslateConfigModule } from '../../translate-config.module';
import { initHapticFeedback } from '@tma.js/sdk';

@Component({
    standalone: true,
    selector: 'app-farm',
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TAIGA_MODULES,
        TranslateConfigModule,
    ],
    styleUrls: ['./farm.component.less'],
    templateUrl: './farm.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { '[class._e2e]': 'isE2E' },
})
export default class FarmComponent {
    isLoader = false;
    farm: any = { getPoints: false, isClaim: false, percent: 0, percentBySecond: 0 };
    user: any;

    readonly max = 100;
    private backendData$ = new BehaviorSubject<any>(this.farm);

    readonly value$: Observable<number> = this.backendData$.pipe(
        switchMap((data: any) => {
            return timer(0, 1000).pipe(
                map(i => Math.floor(data.percent + i * data.percentBySecond)),
                startWith(data.percent),
                takeWhile(value => value <= this.max),
            )
        })
    );

    readonly trigger$ = new Subject<void>();
    readonly loading$ = this.trigger$.pipe(
        switchMap(() => timer(2000).pipe(map(() => false), startWith('Loading'))),
    );
    timerId: any = null;
    private destroy$ = new Subject<void>();

    constructor(
        public translate: TranslateService,
        private farmService: FarmService,
        private cdRef: ChangeDetectorRef,
        @Inject(TUI_IS_E2E) readonly isE2E: any,
        private globalService: GlobalService,
        private scrollService: ScrollControlService
    ) {
        translate.use(globalService.getLng());
    }

    ngOnInit() {
        this.farmStatus();
        this.globalService.getUser().subscribe((data: any) => {
            this.user = data;
            this.cdRef.markForCheck()
        })

    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    farmStatus() {
        this.farmService.getStatus().pipe(
            takeUntil(this.destroy$)
        ).subscribe((data: any) => {
            this.farm = data;
            if (data.getPoints === false && data.isClaim === false) {
                this.isLoader = true;
                this.backendData$.next(data);
                setTimeout(() => {
                    this.isLoader = false;
                }, 1000)
            }

            this.cdRef.markForCheck();
            this.cdRef.detectChanges();

            if (data?.getPoints === false && data?.isClaim === false) {
                if (this.timerId) {
                    clearTimeout(this.timerId);
                }
                this.timerId = setTimeout(() => {
                    this.farmStatus();
                }, ((100 - data.percent) / data.percentBySecond) * 1000);
            }
        });
    }

    farmClaim() {
        this.isLoader = true;
        this.farmService.claim({}).pipe(
            takeUntil(this.destroy$)
        ).subscribe(() => {
            this.farmStatus();

            this.isLoader = false;
        });
    }

    farmPoints() {
        this.isLoader = true;
        this.farmService.getPoints({}).pipe(
            takeUntil(this.destroy$)
        ).subscribe(() => {
            this.farmStatus();
            this.globalService.refreshUser().pipe(
                takeUntil(this.destroy$)
            ).subscribe((user: any) => {
                this.user = user;
                const haptic = initHapticFeedback()
                haptic.notificationOccurred('success');
                this.scrollService.makeConfetti();
            });
            this.isLoader = false;
        });
    }

    action() {
        if (this.farm.isClaim === true) {
            this.farmClaim()

        } else if (this.farm.getPoints === true) {
            this.farmPoints()
        }
    }


}
