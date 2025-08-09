import { Component } from '@angular/core';
import { FindCapital } from "../capitals/find-capital/find-capital";
import { FindFlag } from "../flags/find-flag/find-flag";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game',
  imports: [FindCapital, FindFlag, CommonModule],
  templateUrl: './game.html',
  styleUrl: './game.css'
})
export class Game {
  subgamemode = sessionStorage.getItem('subgamemode') || 'findCapital';
}
