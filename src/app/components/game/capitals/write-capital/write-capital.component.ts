import { Component, OnInit, OnChanges, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { GameService } from '../../../../services/game.service';
import { Country } from '../../../../types/country.type';
import { CommonModule } from '@angular/common';
import { ConvertService } from '../../../../services/convert.service';
import { CountryCode } from '../../../../types/code.type';
import { FormsModule } from '@angular/forms';
import { CountryInfo } from '../../../../types/country-info.type';
import { GameSessionService } from '../../../../services/game-session.service';

@Component({
  selector: "app-write-capital",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./write-capital.component.html",
  styleUrls: ["./write-capital.component.css", "../../game/game.component.css"],
})
export class WriteCapitalComponent implements OnInit, OnChanges {
  protected countries: Country[] = [];
  protected selectedCountry: string = '';
  protected selectedCapitals: string[] = [''];
  protected userAnswer: string = '';
  protected showCorrectAnswerFlag: boolean = false;

  @Input() turn!: number; // new input to track round changes
  @Input() endRound!: boolean; // new input to track end of round

  @Output() answerSelected = new EventEmitter<{selectedCode: CountryCode, correctCode: CountryCode}>();

  constructor(
    private gameService: GameService, 
    private convertService: ConvertService,
    private gameSessionService: GameSessionService
  ) {}

  public ngOnInit(): void {
    this.init();
    this.setCorrectAnswerFlag()
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['turn'] && !changes['turn'].isFirstChange()) {
      this.init();
      this.clearInput();
    }
    if (changes['endRound'] && !changes['endRound'].isFirstChange()) {
      this.setCorrectAnswerFlag();
      if (changes['endRound'].currentValue === true) {
        this.clearInput();
      }
    }
  }

  private setCorrectAnswerFlag() {
    this.showCorrectAnswerFlag = this.showCorrectAnswer();
  }

  private clearInput(): void {
    this.userAnswer = '';
  }

  public showCorrectAnswer(): boolean {
    if (this.endRound) {
      const normalizedUserAnswer = this.convertService.normalizeText(this.userAnswer);
      const hasMatch = this.selectedCapitals.some(capital => 
        this.convertService.normalizeText(capital) === normalizedUserAnswer
      );
      return !hasMatch;
    }
    
    return false;
  }

  public saveUserAnswerSession(value: string): void {
    this.gameSessionService.setSessionItem('userAnswer', value);
  }

  public onAnswerSelect(answer: {userAnswer: string }): void {
    const countryInfo: CountryInfo | null = this.convertService.convertCapitalToCountry(answer.userAnswer);
    this.answerSelected.emit({
      selectedCode: countryInfo ? countryInfo.flag : '',
      correctCode: this.gameService.selectedCountryCode
    });
  }

  private init(): void {
    // console.log('FindCapital Component Initialized');
    this.gameService.initializeGame(1);
    this.countries = this.gameService.getCountries();
    const countryInfo: CountryInfo | null = this.convertService.convertCodeToCountry(this.gameService.selectedCountryCode)
    this.selectedCountry = countryInfo?.country[this.convertService.language] || '';
    this.selectedCapitals = countryInfo?.capital[this.convertService.language] || [''];
    
    const sessionItem = this.gameSessionService.getSessionItem("userAnswer")
    this.userAnswer = sessionItem ? sessionItem : '';
  }
}
