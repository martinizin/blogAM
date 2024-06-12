import { Component } from '@angular/core';
import { UploadService } from '../services/upload.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  constructor(private uploadService: UploadService) {}

  async uploadPhoto() {
    const url = await this.uploadService.uploadPhoto();
    console.log('Photo uploaded:', url);
  }

  // async uploadPDF(filePath: string) {
  //   const url = await this.uploadService.uploadPDF(filePath);
  //   console.log('PDF uploaded:', url);
  // }

  async getLocation() {
    const location = await this.uploadService.getCurrentLocation();
    console.log('Location:', location);
  }
}
