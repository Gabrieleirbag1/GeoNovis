import { Injectable } from '@angular/core';
import { Countries } from '../types/countries.type';

@Injectable({
  providedIn: 'root',
})
export class FindCapitalService {
  language: string = 'fr'; // default language

  constructor() {}

  selectCountries(infos: any[], iterations: number): Countries[] {
    const countries: Countries[] = [];
    for (let i = 0; i < iterations; i++) {
      const randomIndex = Math.floor(Math.random() * infos.length);
      const countryData = infos[randomIndex];

      countries.push({
        name: countryData.country[this.language],
        capital: countryData.capital[this.language],
        continent: countryData.continent[this.language],
        flag: countryData.flag,
      });
    }
    return countries;
  }
}
