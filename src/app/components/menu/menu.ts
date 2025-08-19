import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import menuConfigData from '../../../assets/data/menu-config.json';
import { GameSessionService } from '../../services/game-session.service';
import { routes } from '../../app.routes';
import { Router } from '@angular/router';
@Component({
  selector: 'app-menu',
  imports: [CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu implements OnInit {
  currentRoute: string;
  menuConfig: any;
  language: string = 'fr'; // default
  gameStarted: boolean = false;

  constructor(private gameSessionService: GameSessionService, private routes: Router) {
    this.currentRoute = window.location.pathname.split('/').slice(-1)[0] || 'region';
  }

  ngOnInit() {
    if (this.gameSessionService.getSessionItem('gameStarted') === 'true') {
      this.gameStarted = true;
    }

    this.menuConfig = menuConfigData.menus[this.currentRoute as keyof typeof menuConfigData.menus];
    if (!this.menuConfig) {
      this.menuConfig = menuConfigData.menus["region" as keyof typeof menuConfigData.menus];
    }
    console.log('Menu Config:', this.menuConfig);
  }

  handleNextMenu(menuType: string, id: string, start: boolean | null, submenu: boolean | null, route: string): void {
    if (submenu) {
      console.log('Submenu not implemented yet');
      return;
    }
    if (start) {
      console.log('Starting new game or action'); // Placeholder for start action
      this.gameSessionService.setSessionItem('menu_3', id);
      route = "rules";
    }
    this.gameSessionService.setSessionItem(menuType, id);
    this.routes.navigate([`/${route}`]);
  }

  handleBackMenu(): void {
    const previousRoute = this.menuConfig.referrer || 'region';
    this.routes.navigate([`/${previousRoute}`]);
  }

  redirectGame(): void {
    this.routes.navigate(['/game']);
  }

}
