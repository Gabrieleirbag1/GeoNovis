import { Component, OnInit, OnChanges, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { GameService } from '../../../../services/game.service';
import { Country } from '../../../../types/countrie.type';
import { CommonModule } from '@angular/common';
import { ConvertService } from '../../../../services/convert.service';
import { CountryCode } from '../../../../types/code.type';
import { FormsModule } from '@angular/forms';
import { CountryInfo } from '../../../../types/country-info.type';

@Component({
  selector: "app-write-capital",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./write-capital.component.html",
  styleUrls: ["./write-capital.component.css", "../../game/game.component.css"],
})
export class WriteCapitalComponent implements OnInit, OnChanges {
  countries: Country[] = [];
  selectedCountry: string = '';
  userAnswer: string = '';

  @Input() turn!: number; // new input to track round changes

  @Output() answerSelected = new EventEmitter<{selectedCode: CountryCode, correctCode: CountryCode}>();

  constructor(
    private gameService: GameService, 
    private convertService: ConvertService
  ) {}

  ngOnInit(): void {
    this.init();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['turn'] && !changes['turn'].isFirstChange()) {
      this.init();
      this.clearInput();
    }
  }

  private clearInput(): void {
    this.userAnswer = '';
  }

  onAnswerSelect(country: any): void {
    const countryInfo: any | null = this.convertService.convertCapitalToCountry(country.userAnswer);
    this.answerSelected.emit({
      selectedCode: countryInfo ? countryInfo.flag : '',
      correctCode: this.gameService.selectedCountryCode
    });
  }

  init(): void {
    // console.log('FindCapital Component Initialized');
    this.gameService.initializeGame(1);
    this.countries = this.gameService.getCountries();
    const countryInfo: CountryInfo | null = this.convertService.convertCodeToCountry(this.gameService.selectedCountryCode)
    this.selectedCountry = countryInfo?.country[this.convertService.language] || '';
  }
}
