import { Injectable } from '@angular/core';
import gameCodes from '../../assets/data/game-codes.json';

@Injectable({
  providedIn: 'root'
})
export class SelectorService {
    private gameCodes: any;
    
    constructor() {
        this.gameCodes = gameCodes;
    }
    
    getRandomNotFoundCode(): string {
        const codes = Object.keys(this.gameCodes);
        const randomIndex = Math.floor(Math.random() * codes.length);
        if (!this.gameCodes[codes[randomIndex]].found)
            return codes[randomIndex];
        return this.getRandomNotFoundCode();
    }

}
