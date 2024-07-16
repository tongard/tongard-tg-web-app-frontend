import { CommonModule } from '@angular/common';

import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
} from '@angular/core';

// TAIGA
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TAIGA_MODULES } from '../taiga-all-modules/taiga.module';
import { Router } from '@angular/router';

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
        private router: Router
    ) { }

    ngOnInit(): void {
        setTimeout(() => {
            this.router.navigate(['/']);
        }, 3000);
      }
}
