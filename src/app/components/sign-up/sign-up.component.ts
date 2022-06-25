import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import { HotToastService } from '@ngneat/hot-toast';
import { switchMap } from 'rxjs';

import { AuthenticationService } from '../../services/authentication.service';
import { UsersService } from '../../services/users.service';

export function passwordsMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if(password && confirmPassword && password !== confirmPassword) {
      return {
        passwordsDontMatch: true
      }
    }
    return null;
  }
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  signupForm = new FormGroup(
    {
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),
    },
    { validators: passwordsMatchValidator() }
  );
  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private toast: HotToastService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {}

  get name() {
    return this.signupForm.get('name');
  }
  get email() {
    return this.signupForm.get('email');
  }
  get password() {
    return this.signupForm.get('password');
  }
  get confirmPassword() {
    return this.signupForm.get('confirmPassword');
  }

  submit() {
    if (!this.signupForm.valid) return;
    const { name, email, password } = this.signupForm.value;
    this.authService.signup(email, password)
      .pipe(
        switchMap(({ user: { uid }}) => this.usersService.addUser({ uid, email, displayName: name})),
        this.toast.observe({
          loading: 'Uploading profile image...',
          success: 'Image uploaded successfully',
          error: 'There was an error in uploading the image',
        })
      )
      .subscribe(() => {
        this.router.navigate(['/home']);
      }
      );
  }
}
