import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GameService } from '../../../../services/game.service';
import { Countries } from '../../../../types/countries.type';
import { CommonModule } from '@angular/common';
import { ConvertService } from '../../../../services/convert.service';
import { CountryCode } from '../../../../types/code.type';

@Component({
  selector: 'app-find-capital',
  imports: [CommonModule],
  templateUrl: './find-capital.html',
  styleUrl: './find-capital.css'
})
export class FindCapital implements OnInit {
  countries: Countries[] = [];
  selectedCountry: string = '';
  
  @Output() answerSelected = new EventEmitter<{selectedCode: CountryCode, correctCode: CountryCode}>();

  constructor(
    private gameService: GameService, 
    private convertService: ConvertService
  ) {}

  ngOnInit(): void {
    console.log('FindCapital Component Initialized');
    this.gameService.initializeGame(6);
    this.countries = this.gameService.getCountries();
    this.selectedCountry = this.convertService.convertCodeToCountry(
      this.gameService.selectedCountryCode
    ).country[this.convertService.language];
  }

  onAnswerSelect(country: any): void {
    this.answerSelected.emit({
      selectedCode: country.code,
      correctCode: this.gameService.selectedCountryCode
    });
  }
}