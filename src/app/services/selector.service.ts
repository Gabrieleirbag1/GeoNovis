import { Injectable } from "@angular/core";
import { GameSessionService } from "./game-session.service";
import { CountryCode } from "../types/code.type";
import { GameSaveService } from "./game-save.service";
import { Language } from "../types/language.type";
import { LanguageService } from "./language.service";
import worldCodes from "../../assets/data/world-codes.json";
import { GameStateService } from "./game-state.service";

@Injectable({
  providedIn: "root",
})
export class SelectorService {
  language: Language = "fr"; // Default language
  selectedCountry: CountryCode = "";

  constructor(private gameSessionService: GameSessionService, private gameSaveService: GameSaveService, private languageService: LanguageService, private gameStateService: GameStateService) {
    this.language = this.languageService.getLanguage();
  }

  public getRandomNotFoundCodes(iterations: number): CountryCode[] {
    const gameState = this.gameSessionService.getGameState();
    // First, get all not-found codes
    const availableCodes: CountryCode[] = Object.keys(gameState)
      .filter((key) => !gameState[key].found)
      .map((key) => gameState[key].code as CountryCode);

    if (iterations > availableCodes.length) {
      // Filter otherCodes to exclude already found codes
      const otherCodes = Object.keys(worldCodes)
        .map((key) => (worldCodes as any)[key].code as CountryCode)
        .filter((code) => !availableCodes.includes(code));

      // Add random codes from filtered otherCodes
      while (availableCodes.length < iterations && otherCodes.length > 0) {
        const randomIndex = Math.floor(Math.random() * otherCodes.length);
        const randomCode = otherCodes[randomIndex];

        if (!availableCodes.includes(randomCode)) {
          availableCodes.push(randomCode);
          this.gameStateService.addAditionnalCountry(randomCode);
        }

        // Remove this code from otherCodes to avoid infinite loop if running out of options
        otherCodes.splice(randomIndex, 1);
      }
    }
    return availableCodes.sort((a, b) => a.localeCompare(b)).slice(0, iterations);
  }

  public getSelectedCountry(codes: CountryCode[]): CountryCode {
    this.assignSelectedCountry(codes);
    console.log("Selected country:", this.selectedCountry);
    return this.selectedCountry;
  }

  private assignSelectedCountry(codes: CountryCode[]): void {
    const gameState = this.gameSessionService.getGameState();
    console.log("Game state in assignSelectedCountry:", gameState);
    for (const code in gameState) {
      if (gameState[code].selected) {
        this.selectedCountry = gameState[code].code;
        return; // Exit after finding the first selected country
      }
    }
    console.log("No selected country found, selecting a new one.");
    this.setRandomSelectedCountry(codes);
  }

  private selectNotFoundCode(codes: CountryCode[]): CountryCode | null {
      const gameState = this.gameSessionService.getGameState();
      const availableCodes = codes.filter(code => gameState[code] && !gameState[code].found);

      if (availableCodes.length === 0) {
          throw new Error("All codes have been found. Cannot select a not-found code.");
      }

      const randomIndex = Math.floor(Math.random() * availableCodes.length);
      return availableCodes[randomIndex];
  }

  private setRandomSelectedCountry(codes: CountryCode[]): void {
    const selectedCode = this.selectNotFoundCode(codes);
    if (!selectedCode) {
      throw new Error("No available code to select as the selected country.");
    }
    const gameState = this.gameSessionService.getGameState();
    if (gameState[selectedCode]) {
      gameState[selectedCode].selected = true;
      this.gameSaveService.setCorrectCountryCode(selectedCode);
      this.selectedCountry = gameState[selectedCode].code;
    }
  }
}
