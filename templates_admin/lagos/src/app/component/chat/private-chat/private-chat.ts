import { Component } from '@angular/core';

import { CommonSvgIcon } from '../../../shared/components/common-svg-icon/common-svg-icon';
import { ChatBox } from '../widgets/chat-box/chat-box';
import { ChatFilter } from '../widgets/chat-filter/chat-filter';

@Component({
  selector: 'app-private-chat',
  templateUrl: './private-chat.html',
  styleUrls: ['./private-chat.scss'],
  imports: [ChatFilter, ChatBox, CommonSvgIcon],
})
export class PrivateChat {
  public isShow: boolean = false;
}
