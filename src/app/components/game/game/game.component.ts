import { Component, OnInit, OnDestroy, HostListener } from "@angular/core";
import { FindCapital } from "../capitals/find-capital/find-capital.component";
import { FindFlag } from "../flags/find-flag/find-flag.component";
import { FindCountryByFlagComponent } from "../flags/find-country-by-flag/find-country-by-flag.component";
import { CommonModule } from "@angular/common";
import { GameSessionService } from "../../../services/game-session.service";
import { GameStateService } from "../../../services/game-state.service";
import { CountryCode } from "../../../types/code.type";
import { WriteCapitalComponent } from "../capitals/write-capital/write-capital.component";
import { FindCountryByCapitalComponent } from "../capitals/find-country-by-capital/find-country-by-capital.component";
import { MapComponent } from "../map/map/map.component";
import { GameSave } from "../../../types/game-save.type";
import { FindCountryByLicensePlate } from "../licensePlates/find-country-by-license-plate/find-country-by-license-plate.component";
import { FindLicensePlate } from "../licensePlates/find-license-plate/find-license-plate.component";
import { LanguageService } from "../../../services/language.service";
import { Endgame } from "../../endgame/endgame";
import { GameSaveService } from "../../../services/game-save.service";

@Component({
  selector: "app-game",
  imports: [FindCapital, FindFlag, CommonModule, WriteCapitalComponent, FindCountryByCapitalComponent, FindCountryByFlagComponent, MapComponent, MapComponent, FindCountryByLicensePlate, FindLicensePlate, Endgame],
  templateUrl: "./game.component.html",
  styleUrl: "./game.component.css",
})
export class Game implements OnInit, OnDestroy {
  subgamemode: string = "map";
  currentRound: number = 0;
  totalRounds: number | null = null;
  endRound: boolean = false;
  endGame: boolean = false;
  isCorrect: boolean = false;
  countryCode: CountryCode = "";

  remainingTime: string = "";
  private timerInterval?: number;
  private endTime: Date | null = null;

  protected language: string = "fr"; // default

  constructor(
    private gameSessionService: GameSessionService,
    protected gameStateService: GameStateService,
    private gameSaveService: GameSaveService,
    protected languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.handleEnd();
    const gameSave = this.gameSessionService.getParsedItem("gameSave") || {};
    this.subgamemode = gameSave.subgamemode.current || "map";
    this.currentRound = gameSave.roundState.current;
    this.totalRounds = gameSave.roundState.total;
    if (!this.endRound) {
      this.initializeCountdown();
    }
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  private initializeCountdown(): void {
    console.log("Initializing countdown...");
    const gameSave = this.gameSessionService.getParsedItem("gameSave");

    if (gameSave.timeLimit.value === "No limit") {
      return;
    }

    const datetime: string | null = gameSave.timeLimit.datetime;
    if (datetime) {
      this.endTime = new Date(datetime);
      this.startCountdownTimer();
    } else {
      this.setNewCountdown();
    }
  }

  private setNewCountdown(): void {
    this.setCountDown();
    this.startCountdownTimer();
  }

  private setCountDown(): void {
    console.log("Setting new countdown...");
    const gameSave = this.gameSessionService.getParsedItem("gameSave");
    const timeLimit = gameSave.timeLimit.value;
    if ((timeLimit as number | string) === "No limit") {
      return;
    }
    const datetime: Date = new Date();
    this.endTime = new Date(datetime.getTime() + timeLimit * 1000);
    gameSave.timeLimit.datetime = this.endTime.toISOString();
    this.gameSessionService.setStringifiedItem("gameSave", gameSave);
    this.remainingTime = this.calculateRemainingTime(this.endTime);
  }

  private startCountdownTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    // Store last update time to ensure smooth countdown
    let lastUpdateTime = Date.now();

    this.timerInterval = setInterval(() => {
      if (!this.endTime) return;

      const now = Date.now();
      // Calculate how many seconds actually passed since last update
      const deltaTime = now - lastUpdateTime;
      lastUpdateTime = now;

      // Update the display
      this.remainingTime = this.calculateRemainingTime(this.endTime);

      // If time has reached zero, handle it
      if (this.remainingTime === "00:00") {
        this.stopCountdown();
        const correctCountryCode = this.gameSessionService.getParsedItem("gameSave").roundState.correctCountryCode;
        // this.correctCountryCode = correctCountryCode;
        this.handleAnswer("", correctCountryCode);
      }
    }, 300); // Update 3 times per second for smoother display
  }

  private calculateRemainingTime(datetimeLimit: Date): string {
    const now = new Date();
    const diff = Math.max(0, datetimeLimit.getTime() - now.getTime());

    if (diff <= 0) {
      return "00:00";
    }

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    return `${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }

  private stopCountdown(): void {
    clearInterval(this.timerInterval);
  }

  private padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  private handleEnd(): void {
    const gameSave = this.gameSessionService.getParsedItem("gameSave");
    this.endGame = gameSave.roundState.endGame;
    if (!this.endGame) {
      this.endRound = gameSave.roundState.endRound;
      if (this.endRound) {
        const { countryCode, correctCountryCode } = this.gameSaveService.getCountryCodes();
        this.checkAnswer(countryCode, correctCountryCode);
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
    this.stopCountdown();

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
    this.isCorrect = this.gameStateService.checkPlayerAnswer(countryCode, correctCountryCode);
    this.countryCode = countryCode;
    this.handleAnswerButtonColorChange(this.isCorrect, countryCode, correctCountryCode);
  }

  private isMultiRoundEnded(): boolean {
    const gameSave = this.gameSessionService.getParsedItem("gameSave");
    const availableSubgamemodes = gameSave.subgamemode.available || ["map"];
    const currentSubgamemode = gameSave.subgamemode.current || "map";
    const availableSubgamemodesLength = availableSubgamemodes.length;

    if (availableSubgamemodesLength - 1 == availableSubgamemodes.indexOf(currentSubgamemode)) {
      this.setSubGamemode(gameSave, availableSubgamemodes[0]);
      return true;
    } else {
      this.setSubGamemode(gameSave, availableSubgamemodes[availableSubgamemodes.indexOf(currentSubgamemode) + 1]);
      return false;
    }
  }

  private setSubGamemode(gameSave: GameSave, subgamemode: string): void {
    this.subgamemode = subgamemode;
    gameSave.subgamemode.current = this.subgamemode;
    this.gameSessionService.setStringifiedItem("gameSave", gameSave);
  }

  @HostListener('document:keyup.enter')
  handleEnterKey(): void {
    if (this.endRound) {
      this.nextTurn();
    }
  }

  nextTurn(): void {
    const isMultiRoundEnded: boolean = this.isMultiRoundEnded();

    if (isMultiRoundEnded) {
      this.gameStateService.nextTurn();
    }

    this.setRoundStateValue("endRound", false);

    this.setNewCountdown();
    if (isMultiRoundEnded) {
      this.changeRound();
    }
  }

  // Add this method to prevent closing when clicking outside
  preventModalClose(event: MouseEvent): void {
    // Prevent event bubbling
    event.stopPropagation();
  }
}
