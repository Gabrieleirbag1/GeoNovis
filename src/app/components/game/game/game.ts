import { Component, OnInit } from '@angular/core';
import { FindCapital } from "../capitals/find-capital/find-capital";
import { FindFlag } from "../flags/find-flag/find-flag";
import { CommonModule } from '@angular/common';
import { GameSessionService } from '../../../services/game-session.service';
import { GameStateService } from '../../../services/game-state.service';
import { CountryCode } from '../../../types/code.type';

@Component({
  selector: 'app-game',
  imports: [FindCapital, FindFlag, CommonModule],
  templateUrl: './game.html',
  styleUrl: './game.css'
})
export class Game implements OnInit {
  gameSave: any;
  subgamemode: string = 'findCapital';
  currentRound: number = 0;
  totalRounds: number | null = null;
  endTurn: boolean = false;
  isCorrect: boolean = false;
  selectedCountryCode: CountryCode = '';

  constructor(
    private gameSessionService: GameSessionService, 
    protected gameStateService: GameStateService
  ) {}

  ngOnInit(): void {
    console.log('Game Component Initialized');
    this.handleEndTurn()
    this.gameSave = this.gameSessionService.getParsedItem('gameSave') || {};
    this.subgamemode = this.gameSave.subgamemode.available[0] || 'findCapital';
    this.currentRound = this.gameSave.roundState.current;
    this.totalRounds = this.gameSave.roundState.total;
  }

  private handleEndTurn(): void {
    const gameSave = this.gameSessionService.getParsedItem('gameSave');
    this.endTurn = gameSave.roundState.endRound;
  }

  private setEndTurn(endTurn: boolean): void {
    this.endTurn = endTurn;
    const gameSave = this.gameSessionService.getParsedItem('gameSave');
    gameSave.roundState.endRound = endTurn;
    this.gameSessionService.setStringifiedItem('gameSave', gameSave);
  }

  checkAnswer(countryCode: CountryCode, correctCountryCode: CountryCode): void {
    this.selectedCountryCode = correctCountryCode;
    this.isCorrect = this.gameStateService.checkPlayerAnswer(countryCode, correctCountryCode);
    console.log('Is answer correct?', this.isCorrect);
    this.setEndTurn(true);
  }

  nextTurn(): void {
    this.gameStateService.nextTurn();
    this.setEndTurn(false);
  }
}