import { Component, OnInit } from '@angular/core';
import { BlogService } from 'src/app/services/blog.service';
import { Observable } from 'rxjs';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Component({
  selector: 'app-blog',
  templateUrl: './blog.page.html',
  styleUrls: ['./blog.page.scss'],
})
export class BlogPage implements OnInit {
  posts$: Observable<any[]>;
  newPostContent: string = '';
  selectedFile: File | null = null;
  selectedPhoto: File | null = null;
  latitude: any = 0;
  longitude: any = 0;
  address: string;
  nombre: string = 'Martin Jimenez';

  constructor(
    private blogService: BlogService,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private firestore: AngularFirestore
  ) { }

  ngOnInit() {
    this.posts$ = this.blogService.getPosts();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log('File selected:', this.selectedFile);
  }

  onPhotoSelected(event: any) {
    this.selectedPhoto = event.target.files[0];
    console.log('Photo selected:', this.selectedPhoto);
  }

  async addPost() {
    let uploadUrl = '';
    let fileType = '';

    if (this.selectedFile) {
      const filePath = `posts/${new Date().getTime()}_${this.selectedFile.name}`;
      uploadUrl = await this.blogService.uploadFile(filePath, this.selectedFile);
      fileType = this.selectedFile.type;
      console.log('Upload URL:', uploadUrl);
    } else if (this.selectedPhoto) {
      const filePath = `posts/${new Date().getTime()}_${this.selectedPhoto.name}`;
      uploadUrl = await this.blogService.uploadFile(filePath, this.selectedPhoto);
      fileType = this.selectedPhoto.type;
      console.log('Upload URL:', uploadUrl);
    }

    await this.blogService.addPost(this.newPostContent, uploadUrl, fileType);
    this.newPostContent = '';
    this.selectedFile = null;
    this.selectedPhoto = null;
  }

 async deletePost(type: 'post' | 'file' | 'location', postId: string, urlOrPath: string) {
    try {
      await this.blogService.deleteItem(type, postId, urlOrPath);
      console.log('Item deleted successfully');
    } catch (error) {
      console.error('Error deleting item', error);
    }
  }

  // Geolocation options
  options = {
    timeout: 10000,
    enableHighAccuracy: true,
    maximumAge: 3600,
  };

  // Use geolocation to get user's device coordinates
    // Use geolocation to get user's device coordinates
    getCurrentCoordinates() {
      this.geolocation.getCurrentPosition(this.options).then((resp) => {
        console.log(resp);
        this.latitude = resp.coords.latitude;
        this.longitude = resp.coords.longitude;
        this.addLocationPost(this.latitude, this.longitude);
      }).catch((error) => {
        console.log('Error getting location', error);
      });
    }
    // Add location as a post
  async addLocationPost(lat: number, long: number) {
    const content = `Ubicación: Latitud ${lat}, Longitud ${long}`;
    await this.blogService.addPost(content);
  }

  // Geocoder options
  nativeGeocoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5,
  };

  // Get address using coordinates
  getAddress(lat: any, long: any) {
    this.nativeGeocoder.reverseGeocode(lat, long, this.nativeGeocoderOptions).then((res: NativeGeocoderResult[]) => {
      this.address = this.pretifyAddress(res[0]);
    }).catch((error: any) => {
      alert('Error getting location' + JSON.stringify(error));
    });
  }

  // Format address
  pretifyAddress(address: any) {
    let obj = [];
    let data = '';
    for (let key in address) {
      obj.push(address[key]);
    }
    obj.reverse();
    for (let val in obj) {
      if (obj[val].length) data += obj[val] + ', ';
    }
    return data.slice(0, -2);
  }

  // Send coordinates to Firebase
  sendCoordinatesToFirebase(lat: number, long: number) {
    const coordinates = {
      latitude: lat,
      longitude: long,
      timestamp: new Date(),
      nombre: this.nombre,
    };
    this.firestore.collection('Localizacion').add(coordinates).then(() => {
      console.log('Coordenadas enviadas a Firebase');
    }).catch((error) => {
      console.error('Error al enviar coordenadas a Firebase', error);
    });
  }
}