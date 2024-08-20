import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, ViewEncapsulation } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import {TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { TAIGA_MODULES } from '../../taiga-all-modules/taiga.module';
import { TaskService } from './user-task.service';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { GlobalService } from '../../services/global.serice';
import { Subject, takeUntil } from 'rxjs';
import { TuiTableBarsHostModule } from '@taiga-ui/addon-tablebars';
import { ScrollControlService } from '../../services/scroll.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslateConfigModule } from '../../translate-config.module';


@Component({
    standalone: true,
    selector: 'app-user-task',
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TAIGA_MODULES,
        TuiTableBarsHostModule,
        TranslateConfigModule

    ],
    styleUrls: ['./user-task.component.less'],
    templateUrl: './user-task.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UserTaskComponent {

    emailPending = false
    tasks: any[] = [];
    isCodeInput:boolean = false;
    user:any;
    email: string = '';
    code: string = '';
    private destroy$ = new Subject<void>();
    timerId: any = null;
     public form = new FormGroup({
        email: new FormControl('',  [Validators.required, Validators.email]),
        code: new FormControl('',[Validators.required, Validators.minLength(6)])
    });

    isFirstTaskLoad = true;
    



    constructor(
        private taskService: TaskService,
        private cdRef: ChangeDetectorRef,
        @Inject(TuiDialogService) private readonly dialogs: TuiDialogService,
        private globalService: GlobalService,
        private scrollService: ScrollControlService,
        public translate: TranslateService
    ) {  
        translate.use(globalService.getLng());       
        this.globalService.getUser().pipe(
            takeUntil(this.destroy$)
          ).subscribe((user:any)=>{
            this.user = user;
            this.cdRef.markForCheck()
        })

    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
        clearTimeout(this.timerId);
      }
    openLink(url:string){
        window.open(url, '_blank');
    }


    ngOnInit(): void {
        this.loadTasks();
        this.form.valueChanges.subscribe((e:any) => {
            this.email = e.email;
            this.code = e.code;

        })
    }

    loadTasks(): void {
        this.taskService.getTasks().pipe(
            takeUntil(this.destroy$)
          ).subscribe((data: any[]) => {
            this.tasks = data;
            this.isFirstTaskLoad = false;
            this.cdRef.markForCheck()
            let minRemainingTime = this.findMinRemainingTime(this.tasks)
            if (minRemainingTime > 0 && minRemainingTime != Infinity) {
                console.log('run update timer',minRemainingTime )
                clearTimeout(this.timerId);
                this.timerId = setTimeout(() => {
                    this.loadTasks()
                }, minRemainingTime * 1000);
            }
        });

    }

    findMinRemainingTime(data: any) {
        // Фильтруем данные для получения всех значений remainingTime, кроме null и 0
        const validTimes = data
            .map((item: any) => item.status.remainingTime)
            .filter((time: any) => time !== null && time > 0);

        // Находим минимальное значение среди валидных
        const minTime = Math.min(...validTimes);

        return minTime;
    }


    start(id: number, item:any): void {
        // task.active = !task.active;
        this.taskService.start(id).pipe(
            takeUntil(this.destroy$)
          ).subscribe(() => {
            if(item.type==='LINK'){
                window.open(item.url, '_blank');
            }
           

            this.loadTasks();
        });
    }

    claim(id: number): void {
        this.taskService.claim(id).pipe(
            takeUntil(this.destroy$)
          ).subscribe(() => {
            this.loadTasks();
            this.globalService.refreshUser().pipe(
                takeUntil(this.destroy$)
              ).subscribe(user=>{
                this.user = user;
                this.cdRef.markForCheck()
                this.scrollService.makeConfetti();
              });
        });
    }

    sendEmail(){
        this.taskService.sendEmail(this.email).pipe(
            takeUntil(this.destroy$)
          ).subscribe(() => {
            this.emailPending = true;
            setTimeout(()=>{
                this.emailPending = false;
                this.cdRef.markForCheck();
            }, 4000)
            this.isCodeInput = true;
            this.cdRef.markForCheck();
        });
    }

    sendCode(){
        this.taskService.sendCode(this.code).pipe(
            takeUntil(this.destroy$)
          ).subscribe((e) => {
            if(e.status === true){
                this.globalService.refreshUser().pipe(
                    takeUntil(this.destroy$)
                  ).subscribe(user=>{
                    this.user = user;
                    this.cdRef.markForCheck();
                    this.scrollService.makeConfetti();
                  });
                }
           
        });
    }


    showDialog(content: PolymorpheusContent<TuiDialogContext>): void {
        this.dialogs.open(content).pipe(
            takeUntil(this.destroy$)
          ).subscribe();
    }
    //it wil congrads






}
