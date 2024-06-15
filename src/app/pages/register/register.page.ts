import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  singUpForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.singUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async singUp() {
    try {
      await this.authService.register(this.singUpForm.value.email, this.singUpForm.value.password);
      this.router.navigateByUrl('/blog');
    } catch (error) {
      console.log(error);
    }
  }

  async onGoogleRegister() {
    try {
      await this.authService.googleSignIn();
      this.router.navigateByUrl('/blog');
    } catch (error) {
      console.log(error);
    }
  }
}
