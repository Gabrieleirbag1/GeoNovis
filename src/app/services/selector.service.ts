import { Injectable } from '@angular/core';
import gameCodes from '../../assets/data/game-codes.json';

@Injectable({
  providedIn: 'root',
})
export class SelectorService {
  private gameCodes: any;

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
}
