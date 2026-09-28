import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { FeatherIcons } from '../../shared/components/feather-icons/feather-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FeatherIcons],
})
export class Login {
  public show: boolean = false;
  public loginForm: FormGroup;

  private fb = inject(FormBuilder);
  private router = inject(Router);

  constructor() {
    const userData = localStorage.getItem('user');
    if (userData?.length != null) {
      this.router.navigate(['/dashboard/default']);
    }

    this.loginForm = this.fb.group({
      email: ['Test@gmail.com', [Validators.required, Validators.email]],
      password: ['test123', Validators.required],
    });
  }

  showPassword() {
    this.show = !this.show;
  }

  login() {
    if (
      this.loginForm.value['email'] == 'Test@gmail.com' &&
      this.loginForm.value['password'] == 'test123'
    ) {
      let user = {
        email: 'Test@gmail.com',
        password: 'test123',
        name: 'test user',
      };
      localStorage.setItem('user', JSON.stringify(user));
      this.router.navigate(['/dashboard/default']);
    }
  }
}
