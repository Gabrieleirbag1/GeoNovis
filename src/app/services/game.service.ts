import { Injectable } from '@angular/core';
import { Country } from '../types/countrie.type';
import { SelectorService } from './selector.service';
import { CountryCode } from '../types/code.type';
import { ConvertService } from './convert.service';
import { GameStateService } from './game-state.service';
import { GameSessionService } from './game-session.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  countries: Country[] = [];
  selectedCountryCode: CountryCode = '';

  constructor(
    private selectorService: SelectorService,
    private convertService: ConvertService,
    private gameStateService: GameStateService,
    private gameSessionService: GameSessionService
  ) {}

  private selectCountries(iterations: number): CountryCode[] {
    const codesToFind: CountryCode[] =
      this.selectorService.getRandomNotFoundCodes(iterations);
    console.log('Codes to find:', codesToFind);
    return codesToFind;
  }

  getCountries(): Country[] {
    return this.countries;
  }

  setCountries(countries: Country[]): void {
    this.countries = countries;
  }

  initializeGame(iterations: number): void {
    let turnCodes: CountryCode[] = this.gameStateService.getTurnCodes();
    if (!this.gameSessionService.isGameStateSession(turnCodes)) {
      turnCodes = this.selectCountries(iterations);
    }
    this.selectedCountryCode =
      this.selectorService.getSelectedCountry(turnCodes); // Get the selected country from the game state

    this.countries = this.convertService.convertCodesToCountries(turnCodes); // Convert codes to countries

    this.gameStateService.updateGameState(turnCodes, this.selectedCountryCode); // Update game state with selected countries in session

    console.log('Country after conversion:', this.countries);
  }
}
