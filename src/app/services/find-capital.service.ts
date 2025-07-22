import { Injectable } from '@angular/core';
import { Countries } from '../types/countries.type';
import { SelectorService } from './selector.service';
import worldInfos from '../../assets/data/world-infos.json';

@Injectable({
  providedIn: 'root',
})
export class FindCapitalService {
  language: 'en' | 'fr' = 'fr'; // default language
  countries: Countries[] = [];

  constructor(public selectorService: SelectorService) {}

  isGameStateSession(turnCodes: string[]): boolean {
    if (turnCodes.length === 0) {
      return false;
    } else {
      return true;
    }
  }

  selectCountries(iterations: number): string[] {
    const codesToFind: string[] =
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

  main(iterations: number): void {
    let turnCodes = this.selectorService.getTurnCodes();
    if (!this.isGameStateSession(turnCodes)) {
      turnCodes = this.selectCountries(iterations);
    }
    this.convertCodesToCountries(turnCodes);
    console.log('Countries after conversion:', this.countries);
  }

  convertCodesToCountries(turnCodes: string[]): void {
    this.countries = [];
    turnCodes.forEach((code) => {
      const countryInfo = worldInfos.find((info) => info.flag === code);
      if (countryInfo) {
        this.countries.push({
          code: code,
          name: countryInfo.country[this.language],
          capital: countryInfo.capital[this.language][0],
          continent: countryInfo.continent[this.language],
        });
      }
    });
  }
}
