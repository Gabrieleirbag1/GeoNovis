import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-endround',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './endround.component.html',
  styleUrls: ['./endround.component.css']
})
export class EndRoundComponent implements OnInit {
  @Input() isCorrect: boolean = false;
  @Output() nextClicked = new EventEmitter<void>();
  
  protected language: string = 'fr';
  showModal: boolean = false;
  
  constructor(protected languageService: LanguageService) {
    this.language = this.languageService.getLanguage();
  }
  
  ngOnInit(): void {
    setTimeout(() => {
      this.showModal = true;
    }, 500);
  }
  
  nextTurn(): void {
    this.nextClicked.emit();
  }
  
  preventModalClose(event: MouseEvent): void {
    event.stopPropagation();
  }
}