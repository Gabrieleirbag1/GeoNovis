import { Component } from '@angular/core';
import { GameSessionService } from '../../services/game-session.service';
import { CommonModule } from '@angular/common';
import { ConvertService } from '../../services/convert.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-endgame',
  imports: [CommonModule],
  templateUrl: './endgame.html',
  styleUrl: './endgame.css'
})
export class Endgame {
  protected results: {"gameState": any[], "countryInfo": any[]} = {"gameState": [], "countryInfo": []};
  protected roundsCompleted: number = 0;
  protected score: number = 0;
  protected language: string = 'fr';

  constructor(
    private gameSessionService: GameSessionService,
    private convertService: ConvertService,
    private languageService: LanguageService
  ) {}

  protected ngOnInit(): void {
    this.language = this.languageService.getLanguage();
    this.setResults();
    this.setScore();
  }

  private setResults(): void {
    const gameState = this.gameSessionService.getGameState();
    for (const key in gameState) {
      if (gameState[key].hasOwnProperty('right')) {
        this.results.gameState.push(gameState[key]);
        this.results.countryInfo.push(this.convertService.convertCodeToCountry(gameState[key].code));
        this.roundsCompleted++;
      }
    }
  }

  private setScore(): number {
    this.results.gameState.forEach(result => {
      if (result.right) {
        this.score += 1; // Example scoring logic
      }
    });
    return this.score;
  }
}
