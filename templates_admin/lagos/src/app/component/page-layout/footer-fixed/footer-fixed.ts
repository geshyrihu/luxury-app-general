import { Component } from '@angular/core';

import { FooterLayout } from '../footer-layout/footer-layout';

@Component({
  selector: 'app-footer-fixed',
  templateUrl: './footer-fixed.html',
  styleUrls: ['./footer-fixed.scss'],
  imports: [FooterLayout],
})
export class FooterFixed {}
