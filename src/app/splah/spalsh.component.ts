import { CommonModule } from '@angular/common';

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ViewEncapsulation,
} from '@angular/core';

// TAIGA
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TAIGA_MODULES } from '../taiga-all-modules/taiga.module';
import { Router } from '@angular/router';
import { ScrollControlService } from '../services/scroll.service';

@Component({
    standalone: true,
    selector: 'home',
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TAIGA_MODULES,
    ],
    templateUrl: './spalsh.component.html',
    styleUrls: ['./spalsh.component.less'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SpalshComponent { 

    constructor(
        private router: Router,
        private cdRef: ChangeDetectorRef,
        private scrollService: ScrollControlService
    ) { }

    ngOnInit(): void {
        setTimeout(() => {
            this.scrollService.makeConfetti({
                particleCount: 10,
                spread: 100,
                origin: { y: 1 }
              });
        }, 2850);
        setTimeout(() => {
            this.router.navigate(['/']);
        }, 2850);
      }

      ngAfterViewInit(){
        this.cdRef.markForCheck()
        this.cdRef.detectChanges()
      }
}
