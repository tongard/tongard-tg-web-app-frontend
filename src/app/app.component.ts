import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterModule} from '@angular/router';
import {TuiRoot} from '@taiga-ui/core';

import {ThemeService} from '@services/theme.service';
import {NavigationComponent} from './navigation/navigation.component';
import { CustomSocketService } from './custom.socket.service';
import { TokenService } from './token.service';

@Component({
    standalone: true,
    selector: 'app-root',
    imports: [NavigationComponent, RouterModule, TuiRoot],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    protected themeService = inject(ThemeService);
    public title = 'taiga-lumbermill';
    constructor(private tokenService: TokenService, private socket: CustomSocketService){
        this.tokenService.setToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlciI6e30sImlhdCI6MTcyNDA3MTQ0NH0.T2i9C7ycT0UN3Vz4GD6lo9yQHq4VMxXp3hZ8orYcc_c');

    }
}
