import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

import { FeatherIcons } from '../../../../../shared/components/feather-icons/feather-icons';
import * as data from '../../../../../shared/data/data/social-app/social-app';

@Component({
  selector: 'app-comment-one',
  templateUrl: './comment-one.html',
  styleUrls: ['./comment-one.scss'],
  imports: [FeatherIcons, NgClass],
})
export class CommentOne {
  public commentOneData = data.commentOneData;
}
