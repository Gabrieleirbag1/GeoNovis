import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  imports: [CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu implements OnInit {
  currentRoute: string;

  constructor() {
    this.currentRoute = window.location.pathname.split('/').slice(-1)[0];
  }

  ngOnInit() {
    console.log(this.currentRoute);
  }

}
