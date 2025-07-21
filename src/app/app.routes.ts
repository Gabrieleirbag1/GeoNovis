import { Routes } from '@angular/router';
import { Menu } from './components/menu/menu';
import { Game } from './components/game/game/game';
import { Home } from './components/home/home';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'region', component: Menu },
    { path: 'gamemode', component: Menu },
    { path: 'gamemode/capitals', component: Menu },
    { path: 'gamemode/flags', component: Menu },
    { path: "game", component: Game },
    { path: '**', redirectTo: '' },
];
