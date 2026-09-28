import { Component } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-java-script-behavior',
  templateUrl: './java-script-behavior.html',
  styleUrls: ['./java-script-behavior.scss'],
  imports: [NgbModule],
})
export class JavaScriptBehavior {
  public active = 'home';
}
