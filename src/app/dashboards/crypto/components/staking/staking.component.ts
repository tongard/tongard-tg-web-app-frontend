import {CommonModule, DecimalPipe} from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    signal,
} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {FormsModule} from '@angular/forms';
import {TuiAutoFocus} from '@taiga-ui/cdk';
import type {TuiDialogContext} from '@taiga-ui/core';
import {
    TuiAppearance,
    TuiButton,
    TuiDialog,
    TuiDialogService,
    TuiTitle,
} from '@taiga-ui/core';
import {TuiAvatar} from '@taiga-ui/kit';
import {TuiCardLarge, TuiHeader} from '@taiga-ui/layout';
import {TuiInputNumberModule} from '@taiga-ui/legacy';
import type {PolymorpheusContent} from '@taiga-ui/polymorpheus';

import {CryptoService} from '../../../../services/crypto.service';
import {CoinIconPipe} from '../../pipes/coin-icon.pipe';
import { TuiTabBar } from '@taiga-ui/addon-mobile';
import { GamepadComponent } from 'src/app/dashboards/gamepad/gamepad.component';
import { VideoRoomComponent } from 'src/app/video-room/video-room.component';

@Component({
    standalone: true,
    selector: 'lmb-staking',
    imports: [
        CoinIconPipe,
        CommonModule,
        DecimalPipe,
        FormsModule,
        TuiAppearance,
        TuiAutoFocus,
        TuiAvatar,
        TuiButton,
        TuiCardLarge,
        TuiDialog,
        TuiHeader,
        TuiInputNumberModule,
        TuiTitle,
        TuiTabBar,
        GamepadComponent,
        VideoRoomComponent
    ],
    templateUrl: './staking.component.html',
    styleUrl: './staking.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StakingComponent {
    private readonly dialogs = inject(TuiDialogService);

    protected price = 26;

    protected inputStake = 0;
    protected inputUnstake = 0;
    protected amount = signal(0);
    protected available = 100;

    protected stake = false;

    protected activeItemIndex = 1;
 
    protected readonly items = [
        {
            text: 'Favorites',
            icon: '@tui.heart',
            badge: 3,
        },
        {
            text: 'Calls',
            icon: '@tui.phone',
            badge: 1234,
        },
        {
            text: 'Profile',
            icon: '@tui.user',
        },
        {
            text: 'Settings and configuration',
            icon: '@tui.settings',
            badge: 100,
        },
        {
            text: 'More',
            icon: '@tui.ellipsis',
        },
    ];
 
    protected onClick(item: any): void {
        item.badge = 0;
    }

    protected addAmount(add: number): void {
        this.amount.update((val) => val + add);
    }

    protected showDialog(content: PolymorpheusContent<TuiDialogContext>): void {
        this.dialogs.open(content).subscribe();
    }
}
