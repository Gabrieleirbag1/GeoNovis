import { Injectable } from '@angular/core';
import worldInfos from '../../assets/data/world-infos.json';

@Injectable({
  providedIn: 'root'
})
export class GameSessionService {
    setSessionItem(key: string, value: string): void {
        sessionStorage.setItem(key, value);
    }

    deleteSessionItem(key: string): void {
        sessionStorage.removeItem(key);
    }

    setGameSession(): void {
        // this.setSessionItem('worldInfos', JSON.stringify(worldInfos));
    }
}