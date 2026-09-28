import { Component, inject } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { NavService } from '../../../services/nav.service';

interface languageList {
  language: string;
  code: string;
  type?: string;
  icon: string;
}

@Component({
  selector: 'app-language',
  imports: [],
  templateUrl: './language.html',
  styleUrls: ['./language.scss'],
})
export class Language {
  public navServices: NavService = inject(NavService);
  private translateService: TranslateService = inject(TranslateService);
  public language: boolean = false;
  public languages: languageList[] = [
    {
      language: 'English',
      code: 'en',
      type: 'US',
      icon: 'us',
    },
    {
      language: 'Español',
      code: 'es',
      icon: 'es',
    },
    {
      language: 'Français',
      code: 'fr',
      icon: 'fr',
    },
    {
      language: 'Português',
      code: 'pt',
      type: 'BR',
      icon: 'pt',
    },
  ];

  public selectedLanguage: languageList = {
    language: 'English',
    code: 'en',
    type: 'US',
    icon: 'us',
  };

  changeLanguage(lang: languageList) {
    this.translateService.use(lang.code);
    this.selectedLanguage = lang;
  }
}
