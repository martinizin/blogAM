import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  credentialForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.credentialForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async login() {
    try {
      await this.authService.login(this.credentialForm.value.email, this.credentialForm.value.password);
      this.router.navigateByUrl('/blog');
    } catch (error) {
      console.log(error);
    }
  }

  async onGoogleLogin() {
    try {
      await this.authService.googleSignIn();
      this.router.navigateByUrl('/blog');
    } catch (error) {
      console.log(error);
    }
  }
}
