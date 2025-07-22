import { Component } from '@angular/core';
import gameInfos from '../../../../assets/data/game-infos.json';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms';
import { GameSessionService } from '../../../services/game-session.service';

@Component({
  selector: 'app-rules',
  imports: [CommonModule, FormsModule],
  templateUrl: './rules.html',
  styleUrl: './rules.css'
})
export class Rules {
  gameInfos: any = gameInfos;
  rules: any = {};

  constructor(private gameSessionService: GameSessionService) {}

  protected startGame(): void {
    this.setRules();
    this.setGameSession();
  }

  private setRules(): void {
    const timelimitElement: HTMLInputElement = document.getElementById('timelimit') as HTMLInputElement;
    const roundsElement: HTMLInputElement = document.getElementById('rounds') as HTMLInputElement;

    this.rules = {
      time: timelimitElement.value,
      rounds: roundsElement.value
    };
  }

  private setGameSession(): void {
    this.gameSessionService.setSessionItem('gameStarted', 'true');
    this.gameSessionService.setSessionItem('gameRules', JSON.stringify(this.rules));
  }
}