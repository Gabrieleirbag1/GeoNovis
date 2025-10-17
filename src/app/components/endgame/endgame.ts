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
  protected results: any[] = [];
  protected roundsCompleted: number = 0;
  protected score: number = 0;
  
  constructor(private gameSessionService: GameSessionService) {}

  protected ngOnInit(): void {
    this.setResults();
    this.setScore();
  }

  private setResults(): void {
    const gameState = this.gameSessionService.getGameState();
    for (const key in gameState) {
      if (gameState[key].hasOwnProperty('right')) {
        this.results.push(gameState[key]);
        this.roundsCompleted++;
      }
    }
  }

  private setScore(): number {
    this.results.forEach(result => {
      if (result.right) {
        this.score += 1; // Example scoring logic
      }
    });
    return this.score;
  }
}
