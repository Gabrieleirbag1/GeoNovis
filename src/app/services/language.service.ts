import { Injectable } from '@angular/core';
import { Language } from '../types/language.type';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  defaultLanguage: Language = 'fr';

  constructor() {}

  public getLanguage(): Language {
    const language = localStorage.getItem('geonovislanguage');
    return language ? language as Language : this.defaultLanguage;
  }

  public setLanguage(language: Language): void {
    localStorage.setItem('geonovislanguage', language);
  }
}
