import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { combineLatest, map, startWith } from 'rxjs';

import { UserProfileData } from '../../models/user-profile-data';
import { AuthenticationService } from '../../services/authentication.service';
import { ChatsService } from '../../services/chats.service';
import { UsersService } from '../../services/users.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  searchControl = new FormControl('');
  user$ = this.authService.currentUser$;
  myChats$ = this.chatsService.myChats$;
  users$ = combineLatest([
    this.usersService.allUsers$,
    this.user$,
    this.searchControl.valueChanges.pipe(startWith('')),
  ]).pipe(
    map(([users, user, searchString]) =>
      users.filter(
        (u) =>
          u.displayName?.toLowerCase().includes(searchString?.toLowerCase()) &&
          u.uid !== user?.uid
      )
    )
  );

  constructor(
    private authService: AuthenticationService,
    private usersService: UsersService,
    private chatsService: ChatsService
  ) {}

  ngOnInit(): void {}

  createChat(otherUser: UserProfileData) {
    this.chatsService.createChat(otherUser).subscribe();
  }
}
