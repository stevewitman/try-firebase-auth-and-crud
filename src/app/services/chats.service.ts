import { Injectable } from '@angular/core';

import {
  addDoc,
  collection, collectionData,
  Firestore,
  query,
  where,
} from '@angular/fire/firestore';
import { concatMap, map, take, Observable } from 'rxjs';

import { Chat } from '../models/chat';
import { UserProfileData } from '../models/user-profile-data';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  constructor(
    private firestore: Firestore,
    private usersService: UsersService
  ) {}

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

  get myChats$(): Observable<Chat[]> {
    const ref = collection(this.firestore, 'chats');
    return this.usersService.currentUserProfile$.pipe(
      concatMap((user) => {
        const myQuery = query(
          ref,
          where('userIds', 'array-contains', user?.uid)
        );
        return collectionData(myQuery, { idField: 'id' }).pipe(
          map(chats => this.addChatNameAndPic(user?.uid ?? '', chats as Chat[]))
        ) as Observable<Chat[]>;  
      })
    );
  }

  addChatNameAndPic(currentUserId: string, chats: Chat[]): Chat[] {
    chats.forEach(chat => {
      const otherIndex = chat.userIds.indexOf(currentUserId) === 0 ? 1 : 0;
      const { displayName, photoURL } = chat.users[otherIndex];
      chat.chatName = displayName;
      chat.chatPic = photoURL;
    })
    return chats;
  }

}
