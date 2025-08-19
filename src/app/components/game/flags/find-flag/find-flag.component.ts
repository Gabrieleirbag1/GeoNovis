import { Component, OnInit, OnChanges, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { GameService } from '../../../../services/game.service';
import { Country } from '../../../../types/countrie.type';
import { CommonModule } from '@angular/common';
import { ConvertService } from '../../../../services/convert.service';
import { CountryCode } from '../../../../types/code.type';
import { CountryInfo } from '../../../../types/country-info.type';

@Component({
  selector: 'app-find-flag',
  imports: [CommonModule],
  templateUrl: './find-flag.component.html',
  styleUrls: ['./find-flag.component.css', '../../game/game.css'],
})
export class FindFlag implements OnInit, OnChanges {
  countries: Country[] = [];
  selectedCountry: string = '';

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
    const countryInfo: CountryInfo | null = this.convertService.convertCodeToCountry(this.gameService.selectedCountryCode)
    this.selectedCountry = countryInfo?.country[this.convertService.language] || '';
  }

  getFlagImage(countryCode: string): string {
    return '/images/flags/' + countryCode.toLowerCase() + '.svg';
  }

}