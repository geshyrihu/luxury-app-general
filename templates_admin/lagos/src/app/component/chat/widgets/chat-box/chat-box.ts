import { Component } from '@angular/core';

import * as data from '../.././../../shared/data/data/chat/chat';
import { CommonSvgIcon } from '../../../../shared/components/common-svg-icon/common-svg-icon';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.html',
  styleUrls: ['./chat-box.scss'],
  imports: [CommonSvgIcon],
})
export class ChatBox {
  public chatData = data.massage;
  public isShow: boolean = false;
  public showEmojiPicker: boolean = false;
}
