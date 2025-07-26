import { Injectable } from '@angular/core';
import gameCodes from '../../assets/data/game-codes.json';
import worldInfos from '../../assets/data/world-infos.json';
import { Countries } from '../types/countries.type';
import { GameSessionService } from './game-session.service';

@Injectable({
  providedIn: 'root',
})
export class SelectorService {
  private gameCodes: any;
  language: 'en' | 'fr' = 'fr';

  constructor(private gameSessionService: GameSessionService) {
    this.gameCodes = gameCodes;
  }

  getRandomNotFoundCode(): string {
    const codes = Object.keys(this.gameCodes);
    const randomIndex = Math.floor(Math.random() * codes.length);
    if (!this.gameCodes[codes[randomIndex]].found)
      return this.gameCodes[codes[randomIndex]].code;
    return this.getRandomNotFoundCode();
  }

  getRandomNotFoundCodes(iterations: number): string[] {
    const codes: string[] = [];
    while (codes.length < iterations) {
      const code = this.getRandomNotFoundCode();
      if (!codes.includes(code)) {
        codes.push(code);
      }
    }
    return codes;
  }

  getTurnCodes(): any[] {
    const codes: any[] = [];
    Object.keys(this.gameCodes).forEach((key) => {
      if (this.gameCodes[key].turn) {
        codes.push(this.gameCodes[key].code);
      }
    });
    return codes;
  }

  convertCodesToCountries(turnCodes: string[]): Countries[] {
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

  updateGameTurnStates(codes: string[]): void {
    const gameState = JSON.parse(sessionStorage.getItem('gameState') || '{}');
    codes.forEach((code) => {
      if (gameState[code]) {
        gameState[code].turn = true;
      }
    });
    this.gameSessionService.setSessionItem('gameState', JSON.stringify(gameState));
  }
}
