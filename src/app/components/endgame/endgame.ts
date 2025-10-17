import { Component } from '@angular/core';
import { GameSessionService } from '../../services/game-session.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-endgame',
  imports: [CommonModule],
  templateUrl: './endgame.html',
  styleUrl: './endgame.css'
})
export class Endgame {
  countries: any[] = [];
  roundsCompleted: number = 0;
  constructor(private gameSessionService: GameSessionService) {}

  ngOnInit(): void {
    const gameState = this.gameSessionService.getGameState();
    for (const key in gameState) {
      if (gameState[key].hasOwnProperty('right')) {
        this.countries.push(gameState[key]);
        this.roundsCompleted++;
      }
    }
  }
}
