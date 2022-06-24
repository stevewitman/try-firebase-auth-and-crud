import { Injectable } from '@angular/core';

import { doc, docData, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { from, Observable, of, switchMap } from 'rxjs';

import { UserProfileData } from '../models/user-profile-data';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  
  get currentUserProfile$(): Observable<UserProfileData | null> {
    return this.authService.currentUser$.pipe(
      switchMap(user => {
        if (!user?.uid) {
          return of(null)
        }
        const ref = doc(this.firestore, 'users', user?.uid);
        return docData(ref) as Observable<UserProfileData>;
      })
    )
  }

  constructor(
    private firestore: Firestore,
    private authService: AuthenticationService
  ) {}

  addUser(user: UserProfileData): Observable<void> {
    const ref = doc(this.firestore, 'users', user?.uid);
    return from(setDoc(ref, user));
  }

  updateUser(user: UserProfileData): Observable<void> {
    const ref = doc(this.firestore, 'users', user?.uid);
    return from(updateDoc(ref, {...user}));
  }
}
  