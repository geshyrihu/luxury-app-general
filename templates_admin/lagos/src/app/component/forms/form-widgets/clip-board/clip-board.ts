import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-clip-board',
  templateUrl: './clip-board.html',
  styleUrls: ['./clip-board.scss'],
  imports: [FormsModule],
})
export class ClipBoard {
  public clipboardExample1: string = '';
  public copyHighlightTxt: string = 'Web design is the process of creating websites ';
  public clipboardExample2: string =
    'A web designer must always enhance their work since creating websites is a creative effort. Therefore, a web designer must be more imaginative to produce exceptional results. Blogs about web design assist web designers in learning about new technologies, offer lessons, news, direction for a freebie, and much more. These blogs allow web designers to stay creative and improve their abilities. Therefore, advice from web design blogs is required to improve your business.';
  public paragraphData =
    "On that day, hopes and dreams were crushed. Even though it should have been anticipated, it nonetheless surprised me. The warning indicators have been disregarded in favour of the slim chance that it would actually occur. From a hopeful prospect, it had evolved into an unquestionable conviction that it must be fate. That was up until it wasn't, at which point all of the aspirations and dreams collapsed.";

  private _clipboardService = inject(ClipboardService);

  ngOnInit(): void {
    this._clipboardService.copyResponse$.subscribe(re => {
      if (re.isSuccess) {
        alert('copy success!');
      }
    });
  }

  copyFunction(txt: string) {
    navigator.clipboard.writeText(txt);
    alert('Copied');
  }
  cutFunction(id: string) {
    switch (id) {
      case 'clipboardExample1':
        navigator.clipboard.writeText(this.clipboardExample1);
        this.clipboardExample1 = '';
        break;
      case 'clipboardExample2':
        navigator.clipboard.writeText(this.clipboardExample2);
        this.clipboardExample2 = '';
        break;
      default:
        break;
    }
  }
}
