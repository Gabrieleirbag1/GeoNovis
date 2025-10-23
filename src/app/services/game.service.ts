import { Injectable } from '@angular/core';
import { Country } from '../types/country.type';
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

  public getCountries(): Country[] {
    return this.countries;
  }

  setCountries(countries: Country[]): void {
    this.countries = countries;
  }

  public getRegions(): string[] {
    const gameSave = this.gameSessionService.getParsedItem("gameSave") || {};
    const regionsSet: Set<string> = new Set<string>();
    if (gameSave && gameSave.regions) {
      gameSave.regions.forEach((region: string) => {
        regionsSet.add(region);
      });
    }
    return Array.from(regionsSet);
  }

  public initializeGame(iterations: number): void {
    let turnCodes: CountryCode[] = this.gameStateService.getTurnCodes();
    if (!this.gameSessionService.isGameStateSession(turnCodes)) {
      console.log('Selecting new turn codes...');
      turnCodes = this.selectCountries(iterations);
    }
    console.log('Turn codes selected:', turnCodes);
    this.selectedCountryCode =
      this.selectorService.getSelectedCountry(turnCodes); // Get the selected country from the game state

    this.countries = this.convertService.convertCodesToCountries(turnCodes); // Convert codes to countries

    this.gameStateService.updateGameState(turnCodes, this.selectedCountryCode); // Update game state with selected countries in session

    console.log('Country after conversion:', this.countries);
  }
}
