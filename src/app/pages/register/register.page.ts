import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  singUpForm!: FormGroup;
  
  constructor(
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private authService: AuthenticationService,
    private router: Router,
    private alertCtrl: AlertController,
  ) { }

  ngOnInit() {
    this.singUpForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^.{6,20}$/)]],
    });
  }
  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2500,
      position: 'middle',
    })
    await toast.present();
  }
  resetForm() {
    this.singUpForm.reset();
  }

  async singUp(){
    const loading = await this.loadingCtrl.create();
    await loading.present();

    if (this.singUpForm?.valid) {
      try {
        const userCredential = await this.authService.register(
          this.singUpForm.value.email,
          this.singUpForm.value.password
        )
        loading.dismiss()
        this.resetForm()
        this.presentAlert('Exito', 'cuenta creada')
        this.router.navigate(['/home'])

      }catch (error ) {
        let  errorMessage = 'Hubo un problema al crear la cuenta'
        if (error instanceof Error){
          if (error.stack === 'auth/invalid-email') {
            errorMessage = 'El correo electrónico proporcionado no es válido'
          } else if (error.stack === 'auth/email-already-in-use') {
            errorMessage = 'Su correo electrónico ya está registrado, inicie sesión';
          }
        }
        this.presentAlert('Error', errorMessage);
        console.error(error);
        loading.dismiss();
      }
    } else {
      loading.dismiss();
      this.presentToast('Algo ha sucedido en el servidor');
    }
  }
  async presentAlert(title: string, message: string) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

}
