import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email!: string;
  password!: string;

  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    try {
      await this.authService.loginWithEmail(this.email, this.password);
      this.router.navigate(['/home']);
    } catch (err) {
      console.log(err);
    }
  }

  async loginWithGoogle() {
    try {
      await this.authService.loginWithGoogle();
      this.router.navigate(['/home']);
    } catch (err) {
      console.log(err);
    }
  }
}
