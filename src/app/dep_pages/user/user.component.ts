import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TAIGA_MODULES } from '../../taiga-all-modules/taiga.module';
import { GlobalService } from '../../services/global.serice';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';



@Component({
    standalone: true,
    selector: 'app-user',
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TAIGA_MODULES,
    ],
    styleUrls: ['./user.component.less'],
    templateUrl: './user.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UserComponent {

    user: any;
    private destroy$ = new Subject<void>();
    constructor(

        private cdRef: ChangeDetectorRef,
        public globalService: GlobalService,
        private router: Router

    ) { }

    ngOnInit() {
        this.globalService.getUser().pipe(
            takeUntil(this.destroy$)
        ).subscribe((user: any) => {
            this.user = user;
            this.cdRef.markForCheck()
        })
    }

    navigateTo(path: string) {
        this.router.navigate([path]);
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
