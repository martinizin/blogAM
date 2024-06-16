import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) { }

  getPosts(): Observable<any[]> {
    return this.firestore.collection('posts', ref => ref.orderBy('timestamp', 'desc')).valueChanges();
  }
  addPost(content: string, uploadUrl: string = '', fileType: string = ''): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore.collection('posts').doc(id).set({
      id,
      content,
      uploadUrl,
      fileType,
      timestamp: new Date()
    });
  }

  uploadFile(filePath: string, file: any): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            resolve(url);
          }, err => {
            reject(err);
          });
        })
      ).subscribe();
    });
  }
  // Función para borrar un archivo y su referencia en Firestore
  async deletePost(postId: string, fileUrl: string, fileType: string): Promise<void> {
    try {
      // Eliminar el archivo si es un archivo de tipo imagen
      if (fileType.startsWith('image')) {
        const storageRef = this.storage.refFromURL(fileUrl);
        await storageRef.delete().toPromise();
        console.log('File deleted successfully from Firebase Storage');
      }

      // Eliminar el documento de Firestore
      await this.firestore.collection('posts').doc(postId).delete();
      console.log('Post deleted successfully from Firestore');
    } catch (error) {
      console.error('Error deleting post and file', error);
      throw error;
    }
  }
  async deleteItem(type: 'post' | 'file' | 'location', postId: string, urlOrPath: string): Promise<void> {
    try {
      switch (type) {
        case 'post':
          await this.firestore.collection('posts').doc(postId).delete();
          console.log('Post deleted successfully');
          break;
        case 'file':
          const fileRef = this.storage.refFromURL(urlOrPath);
          await fileRef.delete().toPromise();
          console.log('File deleted successfully');
          break;
        case 'location':
          await this.firestore.collection('Localizacion').doc(postId).delete();
          console.log('Location deleted successfully');
          break;
        default:
          throw new Error('Invalid item type');
      }
    } catch (error) {
      console.error('Error deleting item', error);
      throw error;
    }
  }
 
}
