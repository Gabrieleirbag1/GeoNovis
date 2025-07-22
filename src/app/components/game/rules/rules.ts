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

  constructor(private gameSessionService: GameSessionService) {
  }

  startGame(): void {
    this.writeRules();
    this.gameSessionService.setGameSession();
    console.log('Game started with rules:', this.gameInfos);
  }

  writeRules(): void {
    const timelimitElement: HTMLInputElement = document.getElementById('timelimit') as HTMLInputElement;
    const roundsElement: HTMLInputElement = document.getElementById('rounds') as HTMLInputElement;

    const rules = {
      time: timelimitElement.value,
      rounds: roundsElement.value
    };

    console.log('Game rules written:', rules);
  }
}