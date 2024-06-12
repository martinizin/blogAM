import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { Platform } from '@ionic/angular';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  constructor(
    private storage: AngularFireStorage,
    private platform: Platform,
    private file: File,
    private fileOpener: FileOpener
  ) {}

  async uploadPhoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera
    });

    if (!image || !image.webPath) {
      throw new Error('Failed to take photo');
    }

    const blob = await fetch(image.webPath).then(r => r.blob());

    const filePath = `photos/${new Date().getTime()}.jpeg`;
    const task = this.storage.upload(filePath, blob);

    return task.snapshotChanges().toPromise().then(() => this.storage.ref(filePath).getDownloadURL().toPromise());
  }

  async uploadPDF(file: File) {
    const blob = file;

    const storagePath = `pdfs/${new Date().getTime()}.pdf`;
    const task = this.storage.upload(storagePath, blob);

    return task.snapshotChanges().toPromise().then(() => this.storage.ref(storagePath).getDownloadURL().toPromise());
  }

  async getCurrentLocation() {
    const coordinates = await Geolocation.getCurrentPosition();
    return {
      lat: coordinates.coords.latitude,
      lng: coordinates.coords.longitude
    };
  }
}
