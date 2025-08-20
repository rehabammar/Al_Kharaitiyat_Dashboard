import { Injectable } from '@angular/core';
import { Language } from '../../../Features/auth/models/language.interface';
import { AppConstants } from '../../constants/app_constants';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  static storeLanguage(language: Language): void {
    localStorage.setItem(AppConstants.LANG_KEY, JSON.stringify(language));
  }
  static getLanguage(): Language | null {
    try {
      const languageString = localStorage.getItem(AppConstants.LANG_KEY);
      if (!languageString) return null;

      const language: Language = JSON.parse(languageString);
      return language;
    } catch (error) {
      return null;
    }
  }


  static deleteLanguage(): void {
    localStorage.removeItem(AppConstants.LANG_KEY);
  }
}
