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
import { HttpClientModule } from '@angular/common/http';
import FarmComponent from '../pages/farm/farm.component';
import UserComponent from '../pages/user/user.component';
import { TranslateConfigModule } from '../translate-config.module';
import { GameComponent } from '../pages/game/game.component';

@Component({
    standalone: true,
    selector: 'home',
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TAIGA_MODULES,

        HttpClientModule,
        FarmComponent,
        UserComponent,
        TranslateConfigModule,
        GameComponent
    ],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.less'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent { 
    ready = false;
    constructor(
        private cdRef: ChangeDetectorRef,
    ) { 
        setTimeout(()=>{
            this.ready = true;
            this.cdRef.markForCheck()
            this.cdRef.detectChanges()
        }, 3500)
    }

      ngAfterViewInit(){
        this.cdRef.markForCheck()
        this.cdRef.detectChanges()
      }
}
