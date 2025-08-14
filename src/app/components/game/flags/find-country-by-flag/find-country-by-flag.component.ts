import { Component, OnInit, OnChanges, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { GameService } from '../../../../services/game.service';
import { Countries } from '../../../../types/countries.type';
import { CommonModule } from '@angular/common';
import { ConvertService } from '../../../../services/convert.service';
import { CountryCode } from '../../../../types/code.type';

@Component({
  selector: 'app-find-country-by-flag',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './find-country-by-flag.component.html',
  styleUrls: ['./find-country-by-flag.component.css', '../../game/game.css'],
})
export class FindCountryByFlagComponent implements OnInit, OnChanges {
  countries: Countries[] = [];
  selectedFlag: string = '';

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
    // console.log('FindFlag Component Initialized');
    this.gameService.initializeGame(6);
    this.countries = this.gameService.getCountries();
    this.selectedFlag = this.convertService.convertCodeToCountry(
      this.gameService.selectedCountryCode
    ).flag;
  }

  getFlagImage(countryCode: string): string {
    return '/images/flags/' + countryCode.toLowerCase() + '.svg';
  }

}