import { Component } from '@angular/core';
import gameInfos from '../../../../assets/data/game-infos.json';
import gameSave from '../../../../assets/data/game-save.json';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms';
import { GameSessionService } from '../../../services/game-session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rules',
  imports: [CommonModule, FormsModule],
  templateUrl: './rules.html',
  styleUrl: './rules.css'
})
export class Rules {
  gameInfos: any = gameInfos;
  gameSave: any = gameSave;

  constructor(private gameSessionService: GameSessionService, private routes: Router) {}

  protected startGame(): void {
    this.setRules();
    this.setGameSession();
  }

  private setRules(): void {
    const timelimitElement: HTMLInputElement = document.getElementById('timelimit') as HTMLInputElement;
    const roundsElement: HTMLInputElement = document.getElementById('rounds') as HTMLInputElement;
    const region = this.gameSessionService.getSessionItem('menu_1');
    const gamemode = this.gameSessionService.getSessionItem('menu_2');
    const subgamemode = this.gameSessionService.getSessionItem('menu_3');

    this.gameSave.roundState.total = roundsElement.value;
    this.gameSave.timeLimit.value = timelimitElement.value,
    this.gameSave.region = [region];
    this.gameSave.gamemode.available = [gamemode];
    this.gameSave.subgamemode.available = [subgamemode];
  }

  private setGameSession(): void {
    this.gameSessionService.setSessionItem('gameStarted', 'true');
    this.gameSessionService.setSessionItem('gameSave', JSON.stringify(this.gameSave));
    this.gameSessionService.initGameState();
    this.routes.navigate(['/game']);
  }
}