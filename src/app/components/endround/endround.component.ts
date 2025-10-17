import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-endround',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './endround.component.html',
  styleUrls: ['./endround.component.css']
})
export class EndRoundComponent {
  @Input() isCorrect: boolean = false;
  @Output() nextClicked = new EventEmitter<void>();
  
  protected language: string = 'fr';
  
  constructor(protected languageService: LanguageService) {
    this.language = this.languageService.getLanguage();
  }
  
  nextTurn(): void {
    this.nextClicked.emit();
  }
  
  preventModalClose(event: MouseEvent): void {
    // Prevent event bubbling
    event.stopPropagation();
  }
}
