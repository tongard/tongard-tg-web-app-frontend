import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, ViewEncapsulation } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TAIGA_MODULES } from '../../../taiga-all-modules/taiga.module';
import { TaskService } from './task.service';
import { tuiArrayRemove } from '@taiga-ui/cdk';
import { TUI_PROMPT, TuiPromptData } from '@taiga-ui/kit';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { TuiAlertService, TuiDialogService } from '@taiga-ui/core';

@Component({
    standalone: true,
    selector: 'app-admin-task',
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TAIGA_MODULES,
    ],
    styleUrls: ['./task.component.less'],
    templateUrl: './task.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TaskComponent {
    private destroy$ = new Subject<void>();
    readonly form = new FormGroup({
        title: new FormControl(''),
        url: new FormControl('https://'),
        icon: new FormControl(''),
        points: new FormControl('300'),
    });
    tasks: any[] = [];
    newTask: any = {
        type: 'LINK',
        points: 0,
        active: false,
        pendingTime: 10,
        url: '',
        title: '',
        icon: '',
    };

    points = [
        100, 300, 500, 1000, 2000, 5000
    ];


    constructor(
        private taskService: TaskService,
        private cdRef: ChangeDetectorRef,
        @Inject(TuiDialogService) private readonly dialogs: TuiDialogService,
        @Inject(TuiAlertService) private readonly alerts: TuiAlertService,

    ) { }


    ngOnInit(): void {
        this.loadTasks();
        this.form.valueChanges.subscribe((e: any) => {
            this.newTask.url = e.url;
            this.newTask.title = e.title;
            this.newTask.icon = e.icon;
            this.newTask.points = parseInt(e.points);
        })
    }

    loadTasks(): void {
        this.taskService.getTasks().pipe(
            takeUntil(this.destroy$)
        ).subscribe((data: any[]) => {
            this.tasks = data;
            this.cdRef.markForCheck()
        });

    }

    addTask(): void {
        this.taskService.createTask(this.newTask).pipe(
            takeUntil(this.destroy$)
        ).subscribe(() => {
            this.loadTasks();
        });
    }

    updateTask(task: any): void {
        task.active = !task.active;
        this.taskService.updateTask(task.id, task).pipe(
            takeUntil(this.destroy$)
        ).subscribe(() => {
            this.loadTasks();
        });
    }


    confirmRemove(index: number, id: number): void {
        const data: TuiPromptData = {
            content:
                'Do you realy want delete this task? #' + id,
            yes: 'Yes, I want to do it',
            no: 'No',
        };

        this.dialogs
            .open<boolean>(TUI_PROMPT, {
                label: 'Remove task',
                size: 's',
                data,
            })
            .pipe(switchMap((response: boolean) => {
                if (response === true) {
                    this.taskService.deleteTask(id).pipe(
                        takeUntil(this.destroy$)
                    ).subscribe(() => {
                        this.loadTasks();
                        this.tasks = tuiArrayRemove(this.tasks, index);
                        this.cdRef.markForCheck()
                    });
                    return this.alerts.open('Removed 1 task')
                }
                return "";
            }
            ))
            .subscribe()
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
