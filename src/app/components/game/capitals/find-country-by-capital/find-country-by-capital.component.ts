import { Component, OnInit, OnChanges, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { GameService } from '../../../../services/game.service';
import { Country } from '../../../../types/countrie.type';
import { CommonModule } from '@angular/common';
import { ConvertService } from '../../../../services/convert.service';
import { CountryCode } from '../../../../types/code.type';
import { CountryInfo } from '../../../../types/country-info.type';

@Component({
  selector: 'app-find-country-by-capital',
  imports: [CommonModule],
  templateUrl: './find-country-by-capital.component.html',
  styleUrls: ['./find-country-by-capital.component.css', '../../game/game.component.css'],
})
export class FindCountryByCapitalComponent implements OnInit, OnChanges {
  countries: Country[] = [];
  selectedCapital: string[] = [];

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
    }
  }

  onAnswerSelect(country: any): void {
    this.answerSelected.emit({
      selectedCode: country.code,
      correctCode: this.gameService.selectedCountryCode
    });
  }

  init(): void {
    // console.log('FindCapital Component Initialized');
    this.gameService.initializeGame(6);
    this.countries = this.gameService.getCountries();
    const countryInfo: CountryInfo | null = this.convertService.convertCodeToCountry(this.gameService.selectedCountryCode)
    this.selectedCapital = countryInfo?.capital[this.convertService.language] || [];

  }

}