import { Routes } from '@angular/router';

import { PlayersListComponent } from './components/players-list/players-list';
import { PlayerComponent } from './components/player/player';
import { PlayerEditComponent } from './components/player-edit/player-edit';

export const routes: Routes = [
    {
        path: '',
        component: PlayersListComponent,
    },
    {
        path: 'players/:id/edit',
        component: PlayerEditComponent,
    },
    {
        path: 'players/:id',
        component: PlayerComponent,
    },
    {
        path: '**',
        redirectTo: '',
    },
];