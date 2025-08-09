import { Injectable } from '@angular/core';
import { CountryCode } from '../types/code.type';
import { GameSessionService } from './game-session.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private gameSessionService: GameSessionService) {}

  public checkPlayerAnswer(selectedCountryCode: CountryCode, correctCountryCode: CountryCode): boolean {
    return selectedCountryCode === correctCountryCode;
  }
}
