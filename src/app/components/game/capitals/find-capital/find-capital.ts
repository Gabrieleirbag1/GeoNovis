import { Component, OnInit } from '@angular/core';
import worldInfos from '../../../../../assets/data/world-infos.json';
import { FindCapitalService } from '../../../../services/find-capital.service';
import { Countries } from '../../../../types/countries.type';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-find-capital',
  imports: [CommonModule],
  templateUrl: './find-capital.html',
  styleUrl: './find-capital.css'
})
export class FindCapital implements OnInit{
  countries: Countries[] = []; // Change to array
  constructor(private findCapitalService: FindCapitalService) {}

  ngOnInit(): void {
    console.log('FindCapital Component Initialized');
    this.countries = this.findCapitalService.selectCountries(worldInfos, 6);    
  }
}