import { Component } from '@angular/core';

import { CommonSvgIcon } from '../../../shared/components/common-svg-icon/common-svg-icon';
import { ChatBox } from '../widgets/chat-box/chat-box';
import { ChatFilter } from '../widgets/chat-filter/chat-filter';

@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.html',
  styleUrls: ['./group-chat.scss'],
  imports: [ChatFilter, ChatBox, CommonSvgIcon],
})
export class GroupChat {
  public isShow: boolean = false;

  public imageData = [
    {
      image: 'assets/images/avtar/16.jpg',
    },
    {
      image: 'assets/images/avtar/4.jpg',
    },
    {
      image: 'assets/images/avtar/7.jpg',
    },
    {
      image: 'assets/images/avtar/11.jpg',
    },
    {
      image: 'assets/images/avtar/4.jpg',
    },
    {
      image: 'assets/images/blog/comment.jpg',
    },
    {
      image: 'assets/images/avtar/7.jpg',
    },
  ];
}
