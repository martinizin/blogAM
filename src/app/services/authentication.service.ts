import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public _uid = new BehaviorSubject<any>(null);
  currentUser: any;

  constructor(private ngFireAuth: AngularFireAuth) {}

  async login(email: string, password: string): Promise<any> {
    try {
      const response = await this.ngFireAuth.signInWithEmailAndPassword(email, password);
      console.log(response);
      if (response?.user) {
        this.setUserData(response.user.uid);
      }
    } catch (err) {
      throw err;
    }
  }

  async googleSignIn(): Promise<any> {
    try {
      const response = await this.ngFireAuth.signInWithPopup(new GoogleAuthProvider());
      console.log(response);
      if (response?.user) {
        this.setUserData(response.user.uid);
      }
    } catch (err) {
      throw err;
    }
  }

  async register(email: string, password: string): Promise<any> {
    try {
      const register = await this.ngFireAuth.createUserWithEmailAndPassword(email, password);
      console.log(register);
      const data = { email: email, password: password };
      return data;
    } catch (error) {
      throw error;
    }
  }

  async singOut(): Promise<any> {
    try {
      await this.ngFireAuth.signOut();
      this._uid.next(null);
      return true;
    } catch (error) {
      throw error;
    }
  }

  setUserData(uid: any): void {
    this._uid.next(uid);
    this.currentUser = uid;
  }
}
