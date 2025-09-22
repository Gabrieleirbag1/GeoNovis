import { Routes } from '@angular/router';
import { Menu } from './components/menu/menu.component';
import { Game } from './components/game/game/game.component';
import { Home } from './components/home/home.component';
import { Rules } from './components/game/rules/rules.component';
import { DecodeComponent } from './components/decode/decode.component';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'region', component: Menu },
  { path: 'gamemode', component: Menu },
  { path: 'gamemode/capitals', component: Menu },
  { path: 'gamemode/flags', component: Menu },
  { path: 'gamemode/licensePlates', component: Menu },
  { path: 'game', component: Game },
  { path: 'rules', component: Rules },
  { path: 'decode', component: DecodeComponent },
  { path: '**', redirectTo: '' },
];
