import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { concatMap } from 'rxjs';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { AuthenticationService } from '../../services/authentication.service';
import { ImageUploadService } from '../../services/image-upload.service';
import { UsersService } from '../../services/users.service';
import { UserProfileData } from '../../models/user-profile-data';

@UntilDestroy()
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user$ = this.usersService.currentUserProfile$;

  profileForm = new FormGroup({
    uid: new FormControl(''),
    displayName: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    phone: new FormControl(''),
    address: new FormControl(''),
  })

  constructor(
    private authService: AuthenticationService,
    private imageUploadService: ImageUploadService,
    private toast: HotToastService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.usersService.currentUserProfile$.pipe(
      untilDestroyed(this)
    ).subscribe((user) => {
      this.profileForm.patchValue({ ...user })
    })
  }

  uploadImage(event: any, user: UserProfileData) {
    this.imageUploadService.uploadImage(event.target.files[0], `images/profile${user.uid}`)
      .pipe(
        this.toast.observe({
          loading: 'Uploading profile image...',
          success: 'Image uploaded successfully',
          error: 'There was an error in uploading the image',
        }),
        concatMap((photoURL) => this.usersService.updateUser({ uid: user.uid, photoURL }))
      ).subscribe();
  }

  saveProfile() {
    const profileData = this.profileForm.value;
    this.usersService
      .updateUser(profileData)
      .pipe(
        this.toast.observe({
          loading: 'Saving profile data...',
          success: 'Profile updated successfully',
          error: 'There was an error in updating the profile',
        })
      )
      .subscribe();;
  }

}
