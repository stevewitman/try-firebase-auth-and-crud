import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, map, startWith } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';

import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  searchControl = new FormControl('');
  user$ = this.authService.currentUser$;
  users$ = combineLatest([this.usersService.allUsers$, this.user$, this.searchControl.valueChanges.pipe(startWith(''))])
    .pipe(
      map(([users, user, searchString]) => users.filter(u => u.displayName?.toLowerCase().includes(searchString.toLowerCase()) && u.uid !== user?.uid) )
    );
  constructor(
    private authService: AuthenticationService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {}
}
