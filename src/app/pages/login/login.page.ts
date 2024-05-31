import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormRecord, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import {AuthenticationService} from '../../services/authentication.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  credentialForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private alertController: AlertController,
    private toastCtrl: ToastController,
    private loadingController: LoadingController,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.credentialForm= this.fb.group({
      email: ['',[Validators.required, Validators.email]],
      password: ['',[Validators.required, Validators.minLength(6)]]
    })
  }
  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2500,
      position: 'middle',
    });

    await toast.present();
  }
  resetForm() {
    this.credentialForm.reset();
  }
  async login(){
    const loading = await this.loadingController.create()
    await loading.present()
    if(this.credentialForm.valid){
      const user = await this.authService.login(
        this.credentialForm.value.email,
        this.credentialForm.value.password
      ) .then(res => {
        loading.dismiss();
        this.resetForm();
        this.router.navigate(['/home']);

      })
      .catch(err => {
        loading.dismiss();
        this.presentToast("Credentials are invalid");
      })
    }
  }

}
