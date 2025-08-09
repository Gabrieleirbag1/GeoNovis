import { Injectable } from '@angular/core';
import worldInfos from '../../assets/data/world-infos.json';
import { Countries } from '../types/countries.type';
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
    const gameState = this.getGameState();
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
    const gameState = this.getGameState();
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
    return this.selectedCountry
  }

  assignSelectedCountry(codes: CountryCode[]): void {
    for (const code in this.getGameState()) {
      if (this.getGameState()[code].selected) {
        this.selectedCountry = this.getGameState()[code].code;
      }
    }
    this.setRandomSelectedCountry(codes);
  }

  setRandomSelectedCountry(codes: CountryCode[]): void {
    const randomIndex = Math.floor(Math.random() * codes.length);
    const selectedCode = codes[randomIndex];
    const gameState = this.getGameState();
    if (gameState[selectedCode]) {
      gameState[selectedCode].selected = true;
      this.selectedCountry = gameState[selectedCode].code;
    }
  }

  convertCodesToCountries(turnCodes: CountryCode[]): Countries[] {
    let countries: Countries[] = [];
    turnCodes.forEach((code) => {
      const countryInfo = worldInfos.find((info) => info.flag === code);
      if (countryInfo) {
        countries.push({
          code: code,
          name: countryInfo.country[this.language],
          capital: countryInfo.capital[this.language][0],
          continent: countryInfo.continent[this.language],
        });
      }
    });
    return countries;
  }

  updateGameTurnStates(codes: CountryCode[]): void {
    const gameState = this.getGameState();
    codes.forEach((code) => {
      if (gameState[code]) {
        gameState[code].turn = true;
      }
    });
    this.gameSessionService.setSessionItem('gameState', JSON.stringify(gameState));
  }

  getGameState(): any {
    return JSON.parse(this.gameSessionService.getSessionItem('gameState') || '{}');
  }
}
