import { Component, OnInit } from '@angular/core';
import { GameService } from '../../../../services/game.service';
import { Countries } from '../../../../types/countries.type';
import { CommonModule } from '@angular/common';
import { ConvertService } from '../../../../services/convert.service';
import { GameStateService } from '../../../../services/game-state.service';

@Component({
  selector: 'app-find-flag',
  imports: [CommonModule],
  templateUrl: './find-flag.html',
  styleUrl: './find-flag.css'
})
export class FindFlag {
  countries: Countries[] = [];
  selectedCountry: string = '';
  endTurn: boolean = false;
  isCorrect: boolean = false;
  constructor(private gameService: GameService, private convertService: ConvertService, protected gameStateService: GameStateService) {}

  ngOnInit(): void {
    console.log('FindCapital Component Initialized');
    this.gameService.initializeGame(6);
    this.countries = this.gameService.getCountries();
    this.selectedCountry = this.convertService.convertCodeToCountry(this.gameService.selectedCountryCode).country[this.convertService.language];
  }

  getFlagImage(countryCode: string): string {
    return '/images/flags/' + countryCode.toLowerCase() + '.svg';
  }

  checkAnswer(country: any): void {
    this.isCorrect = this.gameStateService.checkPlayerAnswer(country.code, this.gameService.selectedCountryCode);
    console.log('Is answer correct?', this.isCorrect);
    this.endTurn = true;
  }
}
