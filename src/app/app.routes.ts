import { Routes } from '@angular/router';
import { Menu } from './components/menu/menu';

export const routes: Routes = [
    { path: '', component: Menu },
    { path: 'region', component: Menu },
    { path: 'gamemode', component: Menu },
    { path: 'gamemode/capitals', component: Menu },
    { path: 'gamemode/flags', component: Menu },
    { path: 'capitals', redirectTo: 'gamemode/capitals', pathMatch: 'full' },
    { path: 'flags', redirectTo: 'gamemode/flags', pathMatch: 'full' },
    { path: '**', redirectTo: '' },
];
