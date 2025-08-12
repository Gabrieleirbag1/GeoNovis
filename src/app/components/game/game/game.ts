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
  gameSave: any;
  subgamemode: string = 'findCapital'; // Example value, can be set dynamically based on game state
  currentRound: number = 0;
  totalRounds: number | null = null; // Example value, can be set dynamically based on
  constructor(private gameSessionService: GameSessionService) {}

  ngOnInit(): void {
    console.log('Game Component Initialized');
    this.gameSave = this.gameSessionService.getParsedItem('gameSave') || {};
    this.subgamemode = this.gameSave.subgamemode.available[0] || 'findCapital'; // Default to 'findFlag' if not set
    this.currentRound = this.gameSave.roundState.current || 1; // Default to 1 if not set
    this.totalRounds = this.gameSave.roundState.total || 50; // Default to 50 if not set
  }
}
