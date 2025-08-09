import { Injectable } from '@angular/core';
import { Countries } from '../types/countries.type';
import { SelectorService } from './selector.service';
import { CountryCode } from '../types/code.type';
import { ConvertService } from './convert.service';

@Injectable({
  providedIn: 'root',
})
export class FindCapitalService {
  language: 'en' | 'fr' = 'fr'; // default language
  countries: Countries[] = [];
  selectedCountryCode: CountryCode = '';

  constructor(public selectorService: SelectorService, public convertService: ConvertService) {}

  isGameStateSession(turnCodes: CountryCode[]): boolean {
    if (turnCodes.length === 0) {
      return false;
    } else {
      return true;
    }
  }

  selectCountries(iterations: number): CountryCode[] {
    const codesToFind: CountryCode[] =
      this.selectorService.getRandomNotFoundCodes(iterations);
    console.log('Codes to find:', codesToFind);
    return codesToFind;
  }

  getCountries(): Countries[] {
    return this.countries;
  }

  setCountries(countries: Countries[]): void {
    this.countries = countries;
  }

  initializeGame(iterations: number): void {
    let turnCodes: CountryCode[] = this.selectorService.getTurnCodes();
    if (!this.isGameStateSession(turnCodes)) {
      turnCodes = this.selectCountries(iterations);
      this.selectorService.setRandomSelectedCountry(turnCodes);
    }
    this.selectedCountryCode = this.selectorService.getSelectedCountry(turnCodes); // Get the selected country from the game state

    this.countries = this.convertService.convertCodesToCountries(turnCodes); // Convert codes to countries

    this.selectorService.updateGameState(turnCodes, this.selectedCountryCode); // Update game state with selected countries in session

    console.log('Countries after conversion:', this.countries);
  }


}
