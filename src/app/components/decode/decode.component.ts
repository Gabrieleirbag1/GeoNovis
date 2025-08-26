import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-decode',
  standalone: true,
  imports: [],
  templateUrl: './decode.component.html',
  styleUrl: './decode.component.css'
})
export class DecodeComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
    this.getQueryParams();
  }

  private getQueryParams(): void {
    const queryParams = new URLSearchParams(window.location.search);
    const data = queryParams.get('data');
    console.log('Decoded data:', data);
  }

}
