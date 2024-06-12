import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {
  email!: string;
  password!: string;

  constructor(private authService: AuthService, private router: Router) {}

  async signUp() {
    try {
      await this.authService.signUpWithEmail(this.email, this.password);
      this.router.navigate(['/home']);
    } catch (err) {
      console.log(err);
    }
  }
}
