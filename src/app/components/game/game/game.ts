import { Component, OnInit, ViewChild } from "@angular/core";
import { FindCapital } from "../capitals/find-capital/find-capital";
import { FindFlag } from "../flags/find-flag/find-flag";
import { CommonModule } from "@angular/common";
import { GameSessionService } from "../../../services/game-session.service";
import { GameStateService } from "../../../services/game-state.service";
import { CountryCode } from "../../../types/code.type";

@Component({
  selector: "app-game",
  imports: [FindCapital, FindFlag, CommonModule],
  templateUrl: "./game.html",
  styleUrl: "./game.css",
})
export class Game implements OnInit {
  subgamemode: string = "findCapital";
  currentRound: number = 0;
  totalRounds: number | null = null;
  endTurn: boolean = false;
  isCorrect: boolean = false;
  selectedCountryCode: CountryCode = "";

  constructor(private gameSessionService: GameSessionService, protected gameStateService: GameStateService) {}

  ngOnInit(): void {
    console.log("Game Component Initialized");
    this.handleEndTurn();
    const gameSave = this.gameSessionService.getParsedItem("gameSave") || {};
    this.subgamemode = gameSave.subgamemode.available[0] || "findCapital";
    this.currentRound = gameSave.roundState.current;
    this.totalRounds = gameSave.roundState.total;
  }

  private handleEndTurn(): void {
    const gameSave = this.gameSessionService.getParsedItem("gameSave");
    this.endTurn = gameSave.roundState.endRound;
    if (this.endTurn) {
      const { countryCode, correctCountryCode } = this.getCountryCodes();
      this.checkAnswer(countryCode, correctCountryCode);
    }
  }

  private setEndTurn(endTurn: boolean): void {
    this.endTurn = endTurn;
    const gameSave = this.gameSessionService.getParsedItem("gameSave");
    gameSave.roundState.endRound = endTurn;
    this.gameSessionService.setStringifiedItem("gameSave", gameSave);
  }

  private getCountryCodes(): { countryCode: CountryCode; correctCountryCode: CountryCode } {
    const gameSave = this.gameSessionService.getParsedItem("gameSave");
    return {
      countryCode: gameSave.roundState.countryCode,
      correctCountryCode: gameSave.roundState.correctCountryCode,
    };
  }

  private setCountryCodes(countryCode: CountryCode, correctCountryCode: CountryCode): void {
    const gameSave = this.gameSessionService.getParsedItem("gameSave");
    gameSave.roundState.countryCode = countryCode;
    gameSave.roundState.correctCountryCode = correctCountryCode;
    this.gameSessionService.setStringifiedItem("gameSave", gameSave);
  }

  private changeRound(): void {
    const gameSave = this.gameSessionService.getParsedItem("gameSave") || {};
    gameSave.roundState.current += 1;
    this.gameSessionService.setStringifiedItem("gameSave", gameSave);
    this.currentRound = gameSave.roundState.current;
  }

  handleAnswer(countryCode: CountryCode, correctCountryCode: CountryCode): void {
    if (this.endTurn) {
      return;
    }
    this.checkAnswer(countryCode, correctCountryCode);
    this.setCountryCodes(countryCode, correctCountryCode);
    this.setEndTurn(true);
  }

  checkAnswer(countryCode: CountryCode, correctCountryCode: CountryCode): void {
    this.selectedCountryCode = correctCountryCode;
    this.isCorrect = this.gameStateService.checkPlayerAnswer(countryCode, correctCountryCode);
    console.log("Is answer correct?", this.isCorrect);
  }

  nextTurn(): void {
    this.gameStateService.nextTurn();
    this.setEndTurn(false);
    this.changeRound();
  }
}
