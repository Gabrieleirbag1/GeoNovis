import { Injectable } from '@angular/core';

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
}