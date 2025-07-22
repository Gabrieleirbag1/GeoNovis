import { Injectable } from '@angular/core';
import gameCodes from '../../assets/data/game-codes.json';
import worldInfos from '../../assets/data/world-infos.json';
import { Countries } from '../types/countries.type';

@Injectable({
  providedIn: 'root',
})
export class SelectorService {
  private gameCodes: any;
  language: 'en' | 'fr' = 'fr';

  constructor() {
    this.gameCodes = gameCodes;
  }

  getRandomNotFoundCode(): string {
    const codes = Object.keys(this.gameCodes);
    const randomIndex = Math.floor(Math.random() * codes.length);
    if (!this.gameCodes[codes[randomIndex]].found) return this.gameCodes[codes[randomIndex]].code;
    return this.getRandomNotFoundCode();
  }

  getRandomNotFoundCodes(iterations: number): string[] {
    const codes: string[] = [];
    for (let i = 0; i < iterations; i++) {
      const code = this.getRandomNotFoundCode();
      if (!codes.includes(code)) {
        codes.push(code);
      }
    }
    return codes;
  }

  getTurnCodes(): any[] {
    const codes: any[] = [];
    for (let i = 0; i < gameCodes.length; i++) {
      if (gameCodes[i].turn === true) {
        codes.push(gameCodes[i].code);
      }
    }
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
}
