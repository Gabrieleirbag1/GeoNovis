import { Injectable } from '@angular/core';
import gameCodes from '../../assets/data/game-codes.json';

@Injectable({
  providedIn: 'root',
})
export class GameSessionService {
  getSessionItem(key: string): string | null {
    return sessionStorage.getItem(key);
  }

  setSessionItem(key: string, value: string): void {
    sessionStorage.setItem(key, value);
  }

  deleteSessionItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  setGameState(): void {
    this.setSessionItem('gameState', JSON.stringify(gameCodes));
  }

  getGameState(): any {
    return JSON.parse(this.getSessionItem('gameState') || '{}');
  }

}
