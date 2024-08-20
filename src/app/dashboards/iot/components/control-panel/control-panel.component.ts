import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TuiAppearance, TuiIcon, TuiSurface, TuiTitle} from '@taiga-ui/core';
import {TuiAvatar} from '@taiga-ui/kit';
import {TuiCardLarge, TuiCell, TuiHeader} from '@taiga-ui/layout';

import {ControlPanelService} from './control-panel.service';

@Component({
    standalone: true,
    selector: 'lmb-small-card',
    imports: [
        CommonModule,
        TuiAppearance,
        TuiAvatar,
        TuiCardLarge,
        TuiCell,
        TuiHeader,
        TuiIcon,
        TuiSurface,
        TuiTitle,
    ],
    templateUrl: './control-panel.component.html',
    styleUrl: './control-panel.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlPanelComponent {
    protected controlPanelService = inject(ControlPanelService).controlPanelData;
    protected states = new Array(this.controlPanelService.length).fill(false);
}
