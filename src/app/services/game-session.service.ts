import { Injectable } from '@angular/core';
import worldCodes from '../../assets/data/world-codes.json';
import { CountryCode } from '../types/code.type';

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
    this.setGameState(worldCodes);
  }

  setStringifiedItem(key: string, value: any): void {
    this.setSessionItem(key, JSON.stringify(value));
  }

  getParsedItem(key: string): any {
    const item = this.getSessionItem(key);
    return item ? JSON.parse(item) : null;
  }

  setGameState(gameState: any): void {
    this.setStringifiedItem('gameState', gameState);
  }

  getGameState(): any {
    return JSON.parse(this.getSessionItem('gameState') || '{}');
  }

  isGameStateSession(turnCodes: CountryCode[]): boolean {
    if (turnCodes.length === 0) {
      return false;
    } else {
      return true;
    }
  }

}
