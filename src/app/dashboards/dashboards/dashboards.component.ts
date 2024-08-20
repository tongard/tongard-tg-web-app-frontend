import {AsyncPipe, CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {
    ActivatedRoute,
    ActivationEnd,
    Router,
    RouterLink,
    RouterOutlet,
} from '@angular/router';
import {TuiIcon, TuiSurface, TuiTitle} from '@taiga-ui/core';
import {TuiCardLarge, TuiHeader, TuiNavigation} from '@taiga-ui/layout';
import {filter, map, startWith} from 'rxjs';
import { StakingComponent } from '../crypto/components/staking/staking.component';
import { GamepadComponent } from '../gamepad/gamepad.component';

@Component({
    standalone: true,
    selector: 'lmb-dashboards',
    imports: [
        AsyncPipe,
        CommonModule,
        RouterLink,
        RouterOutlet,
        TuiCardLarge,
        TuiHeader,
        TuiIcon,
        TuiIcon,
        TuiNavigation,
        TuiSurface,
        TuiTitle,
        StakingComponent,
        GamepadComponent
    ],
    templateUrl: './dashboards.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardsComponent {
    private readonly activatedRoute = inject(ActivatedRoute);
    protected data$ = inject(Router).events.pipe(
        filter((e): e is ActivationEnd => e instanceof ActivationEnd),
        map((event) => event.snapshot.firstChild?.data['title']),
        startWith(this.activatedRoute.snapshot.firstChild?.data['title']),
    );
}
