import { Component, OnInit } from '@angular/core';
import { FindCapital } from "../capitals/find-capital/find-capital";
import { FindFlag } from "../flags/find-flag/find-flag";
import { CommonModule } from '@angular/common';
import { GameSessionService } from '../../../services/game-session.service';

@Component({
  selector: 'app-game',
  imports: [FindCapital, FindFlag, CommonModule],
  templateUrl: './game.html',
  styleUrl: './game.css'
})
export class Game implements OnInit{
  gamerules: any;
  subgamemode: string = 'findCapital'; // Example value, can be set dynamically based on game state
  constructor(private gameSessionService: GameSessionService) {}

  ngOnInit(): void {
    console.log('Game Component Initialized');
    this.gamerules = this.gameSessionService.getParsedItem('gameRules') || {};
    this.subgamemode = this.gamerules.subgamemode || 'findCapital'; // Default to 'findFlag' if not set
  }
}
