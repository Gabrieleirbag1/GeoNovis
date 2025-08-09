import { Component, OnInit } from '@angular/core';
import { FindCapitalService } from '../../../../services/find-capital.service';
import { Countries } from '../../../../types/countries.type';
import { CommonModule } from '@angular/common';
import { ConvertService } from '../../../../services/convert.service';
import { GameService } from '../../../../services/game.service';

@Component({
  selector: 'app-find-capital',
  imports: [CommonModule],
  templateUrl: './find-capital.html',
  styleUrl: './find-capital.css'
})
export class FindCapital implements OnInit{
  countries: Countries[] = [];
  selectedCountry: string = '';
  constructor(private findCapitalService: FindCapitalService, private convertService: ConvertService, private gameService: GameService) {}

  ngOnInit(): void {
    console.log('FindCapital Component Initialized');
    this.findCapitalService.initializeGame(6);
    this.countries = this.findCapitalService.getCountries();
    this.selectedCountry = this.convertService.convertCodeToCountry(this.findCapitalService.selectedCountryCode).country[this.convertService.language];
  }
}