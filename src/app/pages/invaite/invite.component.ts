// import { CommonModule } from '@angular/common';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { TAIGA_MODULES } from '../../taiga-all-modules/taiga.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { initUtils } from '@tma.js/sdk';
import { UserService } from '../earn/services/user.service';
import { Subject, takeUntil } from 'rxjs';
import { GlobalService } from '../../services/global.serice';
import { TranslateConfigModule } from '../../translate-config.module';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';





@Component({
  standalone: true,
  selector: 'invite',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TAIGA_MODULES,
    TranslateConfigModule

  ],
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.less'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class InviteComponent {
  utils;
  users: any;
  shareLink: string = '';
  private destroy$ = new Subject<void>();
  invite: any = []
  constructor(
    public translate: TranslateService,
    private userService: UserService,
    private globalService: GlobalService,
    private cdRef: ChangeDetectorRef
  ) {
    translate.use(globalService.getLng());
    this.utils = initUtils();
    this.userService.getInvite().pipe(
      takeUntil(this.destroy$)
    ).subscribe((data: any) => {
      this.users = data.linked;
      this.cdRef.markForCheck();
    });

    this.globalService.getUser().pipe(
      takeUntil(this.destroy$)
    ).subscribe((user: any) => {
      this.shareLink = user.shareLink;
    })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  share() {
    this.utils.shareURL(this.shareLink, `${environment.appNameText}`)
  }
}
