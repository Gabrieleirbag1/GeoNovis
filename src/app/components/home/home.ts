import { Component, OnInit } from '@angular/core';
import { Menu } from '../menu/menu';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [Menu, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  isGame: boolean = sessionStorage.getItem('isGame') === 'true' ? true : false;

  ngOnInit() {

  }

  createGame() {
    this.isGame = true;
    sessionStorage.setItem('isGame', 'true');
  }
}
