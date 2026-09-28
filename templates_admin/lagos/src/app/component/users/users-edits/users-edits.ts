import { Component } from '@angular/core';

import { AddUpdateProjects } from './add-update-projects/add-update-projects';
import { EditProfile } from './edit-profile/edit-profile';
import { MyProfil } from './my-profil/my-profil';

@Component({
  selector: 'app-users-edits',
  templateUrl: './users-edits.html',
  styleUrls: ['./users-edits.scss'],
  imports: [MyProfil, EditProfile, AddUpdateProjects],
})
export class UsersEdits {}
