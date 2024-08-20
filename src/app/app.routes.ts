import { Routes } from '@angular/router';

// import GameComponent from './pages/game/game.component';

export const routes: Routes = [

    {
        path: 'dashboards',
        loadComponent: async () =>
            import('./dashboards/dashboards/dashboards.component').then(
                (mod) => mod.DashboardsComponent,
            ),
        children: [
            // {
            //     path: '',
            //     loadComponent: async () =>
            //         import(
            //             './dashboards/dashboards-list/dashboards-list.component'
            //         ).then((mod) => mod.DashboardsListComponent),
            //     data: {title: ''},
            // },
            {
                path: 'crypto',
                loadComponent: async () =>
                    import('./dashboards/crypto/crypto.component').then(
                        (mod) => mod.CryptoComponent,
                    ),
                data: {title: 'Crypto'},
            },

        ],
    },


    {path: '**', redirectTo: 'dashboards'},
];