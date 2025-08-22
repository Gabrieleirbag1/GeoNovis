import { Component } from '@angular/core';
import gameInfos from '../../../../assets/data/game-infos.json';
import gameSave from '../../../../assets/data/game-save.json';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms';
import { GameSessionService } from '../../../services/game-session.service';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-rules',
  imports: [CommonModule, FormsModule],
  templateUrl: './rules.component.html',
  styleUrl: './rules.component.css'
})
export class Rules {
  gameInfos: any = gameInfos;
  gameSave: any = gameSave;
  showWarningModal: boolean = false;
  warningMessage: string = '';

  constructor(private gameSessionService: GameSessionService, private apiService: ApiService,private routes: Router) {}

  protected startGame(): void {
    const gameStartedState = this.gameSessionService.getSessionItem('gameStarted');
    if (gameStartedState === 'true') {
      this.warningModal('You already have a game in progress. Starting a new game will delete your current progress.');
      return;
    }
    
    this.initializeNewGame();
  }

  private warningModal(message: string): void {
    this.warningMessage = message;
    this.showWarningModal = true;
  }

  confirmStartNewGame(): void {
    this.setShowWarningModal(false);
    this.initializeNewGame();
  }

  cancelStartNewGame(): void {
    this.setShowWarningModal(false);
  }

  private setShowWarningModal(value: boolean): void {
    this.showWarningModal = value;
  }

  private initializeNewGame(): void {
    this.setRules();
    this.setGameSession();
  }

  private setRules(): void {
    const timelimitElement: HTMLInputElement = document.getElementById('timelimit') as HTMLInputElement;
    const roundsElement: HTMLInputElement = document.getElementById('rounds') as HTMLInputElement;
    const currentMenuRegion: string = this.gameSessionService.getSessionItem('menu_1') || 'world';
    const gamemode: string = this.gameSessionService.getSessionItem('menu_2') || 'map';
    const subgamemode: string = this.gameSessionService.getSessionItem('menu_3') || 'map';
    const custom_subgamemodes: string[] = this.gameSessionService.getParsedItem('custom_subgamemodes') || ['map'];
    const custom_regions: string[] = this.gameSessionService.getParsedItem('custom_regions') || ['map'];

    this.gameSave.roundState.total = roundsElement.value;
    this.gameSave.timeLimit.value = timelimitElement.value;
    this.gameSave.timeLimit.datetime = typeof !timelimitElement.value === 'string' 
    ? new Date(new Date().getTime() + parseInt(timelimitElement.value) * 1000).toISOString() : null;
    this.gameSave.region = currentMenuRegion === "world" ? [currentMenuRegion] : custom_regions;
    this.gameSave.gamemode.available = [gamemode];
    this.gameSave.subgamemode.available = subgamemode !== "custom" ? [subgamemode] : custom_subgamemodes;
    this.gameSave.subgamemode.current = this.gameSave.subgamemode.available[0];
  }


  private getGeoCodes(): Promise<any> {
    const regions: string[] = this.gameSave.region;
    return firstValueFrom(this.apiService.getGeoCodes(regions))
      .then((codes: any) => {
        return codes;
      });
  }

  private setGameSession(): void {
    this.gameSessionService.setSessionItem('gameStarted', 'true');
    this.gameSessionService.setSessionItem('gameSave', JSON.stringify(this.gameSave));
    this.getGeoCodes().then((codes: any) => {
      this.gameSessionService.initGameState(codes);
      this.routes.navigate(['/game']);
    });
  }
}