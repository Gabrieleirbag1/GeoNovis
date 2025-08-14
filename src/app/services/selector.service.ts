import { Injectable } from '@angular/core';
import { GameSessionService } from './game-session.service';
import { CountryCode } from '../types/code.type';
import { GameSaveService } from './game-save.service';

@Injectable({
  providedIn: 'root',
})
export class SelectorService {
  language: 'en' | 'fr' = 'fr';
  selectedCountry: CountryCode = '';

  constructor(private gameSessionService: GameSessionService, private gameSaveService: GameSaveService) {}

  getRandomNotFoundCode(): CountryCode {
    const gameState = this.gameSessionService.getGameState();
    const codes = Object.keys(gameState);
    const randomIndex = Math.floor(Math.random() * codes.length);
    if (!gameState[codes[randomIndex]].found)
      return gameState[codes[randomIndex]].code as CountryCode;
    return this.getRandomNotFoundCode();
  }

  getRandomNotFoundCodes(iterations: number): CountryCode[] {
    const codes: CountryCode[] = [];
    while (codes.length < iterations) {
      const code: CountryCode = this.getRandomNotFoundCode();
      if (!codes.includes(code)) {
        codes.push(code);
      }
    }
    return codes.sort((a, b) => a.localeCompare(b));
  }

  getSelectedCountry(codes: CountryCode[]): CountryCode {
    this.assignSelectedCountry(codes);
    console.log('Selected country:', this.selectedCountry);
    return this.selectedCountry
  }

  private assignSelectedCountry(codes: CountryCode[]): void {
    for (const code in this.gameSessionService.getGameState()) {
      if (this.gameSessionService.getGameState()[code].selected) {
        this.selectedCountry = this.gameSessionService.getGameState()[code].code;
        return; // Exit after finding the first selected country
      }
    }
    this.setRandomSelectedCountry(codes);
  }

  private setRandomSelectedCountry(codes: CountryCode[]): void {
    const randomIndex = Math.floor(Math.random() * codes.length);
    const selectedCode = codes[randomIndex];
    const gameState = this.gameSessionService.getGameState();
    if (gameState[selectedCode]) {
      gameState[selectedCode].selected = true;
      this.gameSaveService.setCorrectCountryCode(selectedCode);
      this.selectedCountry = gameState[selectedCode].code;
    }
  }

}
