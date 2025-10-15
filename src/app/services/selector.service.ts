import { Injectable } from '@angular/core';
import { GameSessionService } from './game-session.service';
import { CountryCode } from '../types/code.type';
import { GameSaveService } from './game-save.service';
import { Language } from '../types/language.type';
import { LanguageService } from './language.service';
import worldCodes from '../../assets/data/world-codes.json';


@Injectable({
  providedIn: 'root',
})
export class SelectorService {
  language: Language = 'fr'; // Default language
  selectedCountry: CountryCode = '';

  constructor(private gameSessionService: GameSessionService, private gameSaveService: GameSaveService, private languageService: LanguageService) {
    this.language = this.languageService.getLanguage();
  }

  getRandomNotFoundCode(): CountryCode {
    const gameState = this.gameSessionService.getGameState();
    const notFoundCodes = Object.keys(gameState).filter(code => !gameState[code].found);
    
    // If no unfound codes exist, return a random code
    if (notFoundCodes.length === 0) {
      const codes = Object.keys(gameState);
      const randomIndex = Math.floor(Math.random() * codes.length);
      return gameState[codes[randomIndex]].code as CountryCode;
    }
    
    const randomIndex = Math.floor(Math.random() * notFoundCodes.length);
    return gameState[notFoundCodes[randomIndex]].code as CountryCode;
  }

  getRandomNotFoundCodes(iterations: number): CountryCode[] {
    const gameState = this.gameSessionService.getGameState();
    const notFoundCodes = Object.keys(gameState).filter(code => !gameState[code].found);
    
    // Calculate how many codes we can get from not found ones
    const availableCount = Math.min(iterations, notFoundCodes.length);
    
    // Get unique unfound codes
    const selectedCodes: CountryCode[] = [];
    while (selectedCodes.length < availableCount) {
      const randomIndex = Math.floor(Math.random() * notFoundCodes.length);
      const code = gameState[notFoundCodes[randomIndex]].code as CountryCode;
      
      if (!selectedCodes.includes(code)) {
        selectedCodes.push(code);
        // Remove the selected code to avoid checking it again
        notFoundCodes.splice(randomIndex, 1);
      }
    }
    
    // If we need more codes than unfound ones available, add random codes from worldCodes
    if (selectedCodes.length < iterations) {
      const allCodes = Object.keys(worldCodes);
      while (selectedCodes.length < iterations) {
        const randomIndex = Math.floor(Math.random() * allCodes.length);
        const code = allCodes[randomIndex] as CountryCode;
        
        if (!selectedCodes.includes(code)) {
          selectedCodes.push(code);
        }
      }
    }
    
    return selectedCodes.sort((a, b) => a.localeCompare(b));
  }

  getSelectedCountry(codes: CountryCode[]): CountryCode {
    this.assignSelectedCountry(codes);
    console.log('Selected country:', this.selectedCountry);
    return this.selectedCountry
  }

  private assignSelectedCountry(codes: CountryCode[]): void {
    for (const code in this.gameSessionService.getGameState()) {
      if (this.gameSessionService.getGameState()[code].selected) {
        this.selectedCountry = this.gameSessionService.getGameState()[code].code;
        return; // Exit after finding the first selected country
      }
    }
    this.setRandomSelectedCountry(codes);
  }

  private setRandomSelectedCountry(codes: CountryCode[]): void {
    const randomIndex = Math.floor(Math.random() * codes.length);
    const selectedCode = codes[randomIndex];
    const gameState = this.gameSessionService.getGameState();
    if (gameState[selectedCode]) {
      gameState[selectedCode].selected = true;
      this.gameSaveService.setCorrectCountryCode(selectedCode);
      this.selectedCountry = gameState[selectedCode].code;
    }
  }

}
