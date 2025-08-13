import { Injectable } from '@angular/core';
import { GameSessionService } from './game-session.service';
import { CountryCode } from '../types/code.type';

@Injectable({
  providedIn: 'root',
})
export class GameSaveService {
  constructor(private gameSessionService: GameSessionService) {}

  public setCorrectCountryCode(countryCode: CountryCode): void {
    const gameSave = this.gameSessionService.getParsedItem('gameSave') || {};
    gameSave.roundState.correctCountryCode = countryCode;
    this.gameSessionService.setStringifiedItem('gameSave', gameSave);
  }

}
