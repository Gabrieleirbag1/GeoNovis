import { Component, OnInit } from "@angular/core";
import gameInfos from "../../../../assets/data/game-infos.json";
import gameSave from "../../../../assets/data/game-save.json";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { GameSessionService } from "../../../services/game-session.service";
import { Router } from "@angular/router";
import { ApiService } from "../../../services/api.service";
import { firstValueFrom } from "rxjs";
import { GameInfos } from "../../../types/game-infos.type";
import { GameSave } from "../../../types/game-save.type";
import { LanguageService } from "../../../services/language.service";

@Component({
  selector: "app-rules",
  imports: [CommonModule, FormsModule],
  templateUrl: "./rules.component.html",
  styleUrl: "./rules.component.css",
})
export class Rules implements OnInit {
  protected gameInfos: GameInfos = gameInfos;
  protected gameSave: GameSave = gameSave;
  protected showWarningModal: boolean = false;
  protected warningMessage: string = "";
  protected count: number = 0;
  protected regions: string[] = [];
  protected language: string = "fr"; // default

  constructor(
    private gameSessionService: GameSessionService,
    private languageService: LanguageService,
    private apiService: ApiService,
    private routes: Router
  ) {}

  ngOnInit(): void {
    this.language = this.languageService.getLanguage();
    this.setRegions();
    this.setRounds();
  }

  private setRounds(): void {
    this.getGeoCodesCount().then((count: number) => {
      this.count = count;
      this.gameInfos.rounds.values = this.setMaxRounds();
      this.gameInfos.rounds.default = this.count;
    });
  }

  private setMaxRounds(): Array<number> {
    let roundsValues: Array<number> = [];
    const gameInfosRound = gameInfos.rounds.values;
    for (let roundValue of gameInfosRound) {
      if (roundValue <= this.count) {
        if (!roundsValues.includes(roundValue)) {
          roundsValues.push(roundValue);
        }
      }
    }
    roundsValues.push(this.count);
    return roundsValues;
  }

  private setRegions() {
    const currentMenuRegion: string = this.gameSessionService.getSessionItem("menu_1") || "world";
    const custom_regions: string[] = this.gameSessionService.getParsedItem("custom_regions") || ["map"];
    this.regions = currentMenuRegion === "world" ? [currentMenuRegion] : custom_regions;
  }

  protected startGame(): void {
    const gameStartedState = this.gameSessionService.getSessionItem("gameStarted");
    if (gameStartedState === "true") {
      this.warningModal("You already have a game in progress. Starting a new game will delete your current progress.");
      return;
    }

    this.initializeNewGame();
  }

  private warningModal(message: string): void {
    this.warningMessage = message;
    this.showWarningModal = true;
  }

  confirmStartNewGame(): void {
    this.setShowWarningModal(false);
    this.initializeNewGame();
  }

  cancelStartNewGame(): void {
    this.setShowWarningModal(false);
  }

  private setShowWarningModal(value: boolean): void {
    this.showWarningModal = value;
  }

  private initializeNewGame(): void {
    this.setRules();
    this.setGameSession();
  }

  private setRules(): void {
    this.setRoundSettings();
    this.setTimeSettings();
    this.setRegionSettings();
    this.setGameModeSettings();
    this.setSubGameModeSettings();
    this.clearPreviousGameState();
  }

  private setRoundSettings(): void {
    const roundsElement: HTMLInputElement = document.getElementById("rounds") as HTMLInputElement;
    this.gameSave.roundState.total = roundsElement.value as unknown as number;
  }

  private setTimeSettings(): void {
    const timelimitElement: HTMLInputElement = document.getElementById("timelimit") as HTMLInputElement;
    this.gameSave.timeLimit.value = timelimitElement.value as unknown as number;
    this.gameSave.timeLimit.datetime = typeof !timelimitElement.value === "string" ? new Date(new Date().getTime() + parseInt(timelimitElement.value) * 1000).toISOString() : null;
  }

  private setRegionSettings(): void {
    this.gameSave.regions = this.regions;
  }

  private setGameModeSettings(): void {
    const gamemode: string = this.gameSessionService.getSessionItem("menu_2") || "map";
    this.gameSave.gamemode.available = [gamemode];
  }

  private setSubGameModeSettings(): void {
    const subgamemode: string = this.gameSessionService.getSessionItem("menu_3") || "map";
    const custom_subgamemodes: string[] = this.gameSessionService.getParsedItem("custom_subgamemodes") || ["map"];

    if (subgamemode === "geonovis") {
      this.gameSave.subgamemode.available = ["map", "findCapital", "findFlag", "findLicensePlate"];
      this.gameSave.subgamemode.current = "map";
      return;
    }

    this.gameSave.subgamemode.available = subgamemode !== "custom" ? [subgamemode] : custom_subgamemodes;
    this.gameSave.subgamemode.current = this.gameSave.subgamemode.available[0];
    console.log("Selected subgamemodes:", this.gameSave.subgamemode.available);
  }

  private clearPreviousGameState(): void {
    this.gameSessionService.setSessionItem("userAnswer", "");
  }
  
  private async getGeoCodesCount(): Promise<number> {
    return firstValueFrom(this.apiService.getGeoCodesCount(this.regions)).then((response: { count: number }) => {
      return response.count;
    });
  }

  private async getGeoCodes(): Promise<string[]> {
    return firstValueFrom(this.apiService.getGeoCodes(this.regions)).then((codes: string[]) => {
      return codes;
    });
  }

  private setGameSession(): void {
    this.gameSessionService.setSessionItem("gameStarted", "true");
    this.gameSessionService.setSessionItem("gameSave", JSON.stringify(this.gameSave));
    this.getGeoCodes().then((codes: string[]) => {
      this.gameSessionService.initGameState(codes);
      this.routes.navigate(["/game"]);
    });
  }
}
