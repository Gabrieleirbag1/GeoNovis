import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import menuConfigData from '../../../assets/menu-configs/menu-config.json';

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

  constructor() {
    this.currentRoute = window.location.pathname.split('/').slice(-1)[0] || 'region';
  }

  ngOnInit() {
    this.menuConfig = menuConfigData.menus[this.currentRoute as keyof typeof menuConfigData.menus];
    if (!this.menuConfig) {
      this.menuConfig = menuConfigData.menus["region" as keyof typeof menuConfigData.menus];
    }
    console.log('Menu Config:', this.menuConfig);
  }

}
