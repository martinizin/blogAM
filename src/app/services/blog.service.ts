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
  async deletePost(postId: string, fileUrl: string): Promise<void> {
    try {
      // Eliminar el archivo de Firebase Storage
      const fileRef = this.storage.refFromURL(fileUrl);
      await fileRef.delete().toPromise();

      // Eliminar el documento de Firestore
      await this.firestore.collection('posts').doc(postId).delete();

      console.log('Post and file deleted successfully');
    } catch (error) {
      console.error('Error deleting post and file', error);
      throw error;
    }
  }
 
}
