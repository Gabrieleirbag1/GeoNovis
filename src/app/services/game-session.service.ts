import { Injectable } from '@angular/core';
import gameCodes from '../../assets/data/game-codes.json';

@Injectable({
  providedIn: 'root',
})
export class GameSessionService {
  setSessionItem(key: string, value: string): void {
    sessionStorage.setItem(key, value);
  }

  deleteSessionItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  setGameState(): void {
    this.setSessionItem('gameState', JSON.stringify(gameCodes));
  }

}
