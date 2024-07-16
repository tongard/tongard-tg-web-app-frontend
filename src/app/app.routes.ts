import { Routes } from '@angular/router';
import InviteComponent from './pages/invaite/invite.component';
import TaskComponent from './pages/admin/task/task.component';
import UserTaskComponent from './pages/user-task/user-task.component';

export const routes: Routes = [

    { path: 'task', title: 'a_task', component: TaskComponent },
    { path: 'invite', title: 'u_invite', component: InviteComponent },
    { path: 'user-task', title: 'u_task', component: UserTaskComponent },
    {
        path: '',
        pathMatch: 'full',
        loadComponent: async () => import('./home/home.component'),
    }
];