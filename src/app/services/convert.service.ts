import { Injectable } from '@angular/core';
import { Countries } from '../types/countries.type';
import { CountryCode } from '../types/code.type';
import worldInfos from '../../assets/data/world-infos.json';

@Injectable({
  providedIn: 'root',
})
export class ConvertService {
  language: 'en' | 'fr' = 'fr'; // default language
  constructor() {}

  convertCodesToCountries(turnCodes: CountryCode[]): Countries[] {
    let countries: Countries[] = [];
    turnCodes.forEach((code) => {
      const countryInfo = this.convertCodeToCountry(code);
      if (countryInfo) {
        countries.push({
          code: code,
          name: countryInfo.country[this.language],
          capital: countryInfo.capital[this.language][0],
          continent: countryInfo.continent[this.language],
        });
      }
    });
    return countries;
  }

  convertCodeToCountry(code: CountryCode): any {
    const countryInfo = worldInfos.find((info) => info.flag === code);
    return countryInfo;
  }

  getCountryName(code: CountryCode): string {
    const countryInfo = this.convertCodeToCountry(code);
    return countryInfo ? countryInfo.country[this.language] : '';
  }
}
