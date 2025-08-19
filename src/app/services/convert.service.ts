import { Injectable } from '@angular/core';
import { Country } from '../types/countrie.type';
import { CountryCode } from '../types/code.type';
import worldInfos from '../../assets/data/world-infos.json';
import { CountryInfo } from '../types/country-info.type';

@Injectable({
  providedIn: 'root',
})
export class ConvertService {
  language: 'en' | 'fr' = 'fr'; // default language
  constructor() {}

  convertCodesToCountries(turnCodes: CountryCode[]): Country[] {
    let countries: Country[] = [];
    turnCodes.forEach((code) => {
      const countryInfo = this.convertCodeToCountry(code) as CountryInfo;
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

  convertCodeToCountry(code: CountryCode): CountryInfo | null {
    const countryInfo = worldInfos.find((info) => info.flag === code);
    return countryInfo as CountryInfo || null;
  }

  convertCapitalToCountry(capital: string): CountryInfo | null {
    if (!capital) return null;
    
    const lowercaseCapital = capital.toLowerCase().trim();
    
    const countryInfo = worldInfos.find((info) => {
      return info.capital[this.language].some(
        (capitalName: string) => capitalName.toLowerCase().trim() === lowercaseCapital
      );
    });
    
    console.log('Converted capital to country:', countryInfo);
    return countryInfo as CountryInfo || null;
  }
  
  getCountryName(code: CountryCode): string {
    const countryInfo = this.convertCodeToCountry(code) as CountryInfo;
    return countryInfo ? countryInfo.country[this.language] : '';
  }
}