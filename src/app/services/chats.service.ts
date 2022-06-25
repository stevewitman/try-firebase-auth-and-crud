import { Injectable } from '@angular/core';

import { addDoc, Firestore } from '@angular/fire/firestore';
import { collection } from '@firebase/firestore';
import { concatMap, map, take, Observable } from 'rxjs';

import { UserProfileData } from '../models/user-profile-data';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {

  constructor(
    private firestore: Firestore,
    private usersService: UsersService
  ) { }

  createChat(otherUser: UserProfileData): Observable<string> {
    const ref = collection(this.firestore, 'chats');
    return this.usersService.currentUserProfile$.pipe(
      take(1),
      concatMap((user) =>
        addDoc(ref, {
          userIds: [user?.uid, otherUser?.uid],
          users: [
            {
              displayName: user?.displayName ?? '',
              photoURL: user?.photoURL ?? '',
            },
            {
              displayName: otherUser.displayName ?? '',
              photoURL: otherUser.photoURL ?? '',
            },
          ],
        })
      ),
      map((ref) => ref.id)
    );
  }
}
