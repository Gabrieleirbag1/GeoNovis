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

  initGameState(): void {
    this.setGameState(gameCodes);
  }

  setGameState(gameState: any): void {
    this.setSessionItem('gameState', JSON.stringify(gameState));
  }

  getGameState(): any {
    return JSON.parse(this.getSessionItem('gameState') || '{}');
  }

}
