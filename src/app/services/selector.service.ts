import { Injectable } from '@angular/core';
import { GameSessionService } from './game-session.service';
import { CountryCode } from '../types/code.type';

@Injectable({
  providedIn: 'root',
})
export class SelectorService {
  language: 'en' | 'fr' = 'fr';
  selectedCountry: CountryCode = '';

  constructor(private gameSessionService: GameSessionService) {
  }

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
    return codes;
  }

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
      console.log('Selected country set:', gameState[selectedCode]);
      console.log('Selected country set:', selectedCode);
      this.selectedCountry = gameState[selectedCode].code;
    }
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

    this.gameSessionService.setSessionItem('gameState', JSON.stringify(gameState));
  }

}
