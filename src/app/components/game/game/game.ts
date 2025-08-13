import { Component, OnInit } from "@angular/core";
import { FindCapital } from "../capitals/find-capital/find-capital";
import { FindFlag } from "../flags/find-flag/find-flag";
import { CommonModule } from "@angular/common";
import { GameSessionService } from "../../../services/game-session.service";
import { GameStateService } from "../../../services/game-state.service";
import { CountryCode } from "../../../types/code.type";
import { ConvertService } from "../../../services/convert.service";

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
  endRound: boolean = false;
  endGame: boolean = false;
  isCorrect: boolean = false;
  selectedCountryCode: CountryCode = "";
  language: string = "fr";

  constructor(private gameSessionService: GameSessionService, protected gameStateService: GameStateService) {}

  ngOnInit(): void {
    console.log("Game Component Initialized");
    this.handleEnd();
    const gameSave = this.gameSessionService.getParsedItem("gameSave") || {};
    this.subgamemode = gameSave.subgamemode.available[0] || "findCapital";
    this.currentRound = gameSave.roundState.current;
    this.totalRounds = gameSave.roundState.total;
  }

  private handleEnd(): void {
    const gameSave = this.gameSessionService.getParsedItem("gameSave");
    this.endGame = gameSave.roundState.endGame;
    if (!this.endGame) {
      this.endRound = gameSave.roundState.endRound;
      if (this.endRound) {
        const { countryCode, correctCountryCode } = this.getCountryCodes();
        this.checkAnswer(countryCode, correctCountryCode);
        this.handleAnswerButtonColorChange(this.isCorrect, countryCode, correctCountryCode);
      }
    }
  }

  private setRoundStateValue(key: "endGame" | "endRound", value: boolean): void {
    const obj = this;
    obj[key] = value;
    const gameSave = this.gameSessionService.getParsedItem("gameSave");
    gameSave.roundState[key] = value;
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
    if (gameSave.roundState.current < gameSave.roundState.total) {
      gameSave.roundState.current += 1;
      this.gameSessionService.setStringifiedItem("gameSave", gameSave);
      this.currentRound = gameSave.roundState.current;
    } else {
      this.setRoundStateValue("endGame", true);
      this.gameSessionService.setSessionItem("gameStarted", "false");
    }
  }

  handleAnswer(countryCode: CountryCode, correctCountryCode: CountryCode): void {
    if (this.endRound) {
      return;
    }
    this.checkAnswer(countryCode, correctCountryCode);
    this.setCountryCodes(countryCode, correctCountryCode);
    this.setRoundStateValue("endRound", true);
  }

  private handleAnswerButtonColorChange(isCorrect: boolean, countryCode: CountryCode, correctCountryCode: CountryCode): void {
    setTimeout(() => {
      const buttons = document.getElementsByClassName("answer-btn") as HTMLCollectionOf<HTMLButtonElement>;

      for (let i = 0; i < buttons.length; i++) {
        const buttonNameAttribute = buttons[i].getAttribute("name");
        if (buttonNameAttribute == correctCountryCode) {
          buttons[i].classList.add("correct-answer");
          if (isCorrect) {
            break;
          }
        } else if (buttonNameAttribute == countryCode && countryCode !== correctCountryCode) {
          buttons[i].classList.add("wrong-answer");
        }
      }
    }, 0);
  }

  checkAnswer(countryCode: CountryCode, correctCountryCode: CountryCode): void {
    this.selectedCountryCode = correctCountryCode;
    this.isCorrect = this.gameStateService.checkPlayerAnswer(countryCode, correctCountryCode);
    this.handleAnswerButtonColorChange(this.isCorrect, countryCode, correctCountryCode);
    console.log("Is answer correct?", this.isCorrect);
  }

  nextTurn(): void {
    this.gameStateService.nextTurn();
    this.setRoundStateValue("endRound", false);
    this.changeRound();
  }
}
