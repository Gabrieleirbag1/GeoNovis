import { Injectable } from '@angular/core';
import { CountryCode } from '../types/code.type';
import { GameSessionService } from './game-session.service';
import { GameSaveService } from './game-save.service';

@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  selectedCountryCode: CountryCode = '';
  constructor(private gameSessionService: GameSessionService, private gameSaveService: GameSaveService) {}

  getTurnCodes(): CountryCode[] {
    const gameState = this.gameSessionService.getGameState();
    const codes: CountryCode[] = [];
    for (const code in gameState) {
      if (gameState[code].turn) {
        codes.push(gameState[code].code);
      }
    }
    return codes;
  }

  updateGameState(codes: CountryCode[], selectedCode: CountryCode): void {
    const gameState = this.gameSessionService.getGameState();

    codes.forEach((code) => {
      if (gameState[code]) {
        gameState[code].turn = true;
      }
    });

    if (gameState[selectedCode]) {
      gameState[selectedCode].selected = true;
    }

    this.gameSessionService.setGameState(gameState);
  }

  nextTurn(): void {
    const gameState = this.gameSessionService.getGameState();
    for (const code in gameState) {
      if (gameState[code].turn) {
        gameState[code].turn = false;
      }
      if (gameState[code].selected) {
        gameState[code].selected = false;
        gameState[code].found = true; // Mark as found
        this.selectedCountryCode = gameState[code].code; // Store the selected code
      }
    }
    this.gameSessionService.setGameState(gameState);
  }

  public checkPlayerAnswer(selectedCountryCode: CountryCode, correctCountryCode: CountryCode): boolean {
    return selectedCountryCode === correctCountryCode;
  }
}
