import { Injectable } from '@angular/core';
import { CountryCode } from '../types/code.type';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor() {}

  public checkPlayerAnswer(selectedCountryCode: CountryCode, correctCountryCode: CountryCode): boolean {
    return selectedCountryCode === correctCountryCode;
  }
}
