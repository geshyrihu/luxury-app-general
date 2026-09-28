import { Component } from '@angular/core';

import { UserProfileFifth } from './user-profile-fifth/user-profile-fifth';
import { UserProfileFirst } from './user-profile-first/user-profile-first';
import { UserProfileFourth } from './user-profile-fourth/user-profile-fourth';
import { UserProfileSecound } from './user-profile-secound/user-profile-secound';
import { UserProfileThird } from './user-profile-third/user-profile-third';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.scss'],
  imports: [
    UserProfileFifth,
    UserProfileFirst,
    UserProfileSecound,
    UserProfileFourth,
    UserProfileThird,
    UserProfileSecound,
  ],
})
export class UserProfile {}
