import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { Language } from '../../types/language.type';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class Header {
  currentLanguage: Language;

  constructor(private languageService: LanguageService) {
    this.currentLanguage = this.languageService.getLanguage();
  }

  selectLanguage(language: Language): void {
    this.languageService.setLanguage(language);
    this.currentLanguage = language;
    // Reload the page to reflect language changes
    window.location.reload();
  }
}