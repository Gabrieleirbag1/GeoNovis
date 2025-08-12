import { Injectable } from '@angular/core';
import { GameSessionService } from './game-session.service';

@Injectable({
  providedIn: 'root',
})
export class GameSaveService {
  constructor(private gameSessionService: GameSessionService) {}

  

}
