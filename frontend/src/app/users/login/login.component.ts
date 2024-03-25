import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserServiceService } from 'src/app/services/user-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  isSubmitted = false;
  authError: string | null = null;
  hide = true;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserServiceService,
    private snackBar: MatSnackBar,
    private router: Router,
    private localStorage : LocalStorageService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const email = this.loginForm.get('email').value;
    const password = this.loginForm.get('password').value;

    this.isSubmitted = true;

    this.userService.login(email, password).subscribe(
      (user:{token:string,user:string,isAdmin:boolean}) => {
        this.localStorage.setToken(user.token);
        this.router.navigate(['/']); 
      },
      (error) => {
        if (error.status === 400) {
          this.authError = 'Invalid email or password. Please try again.';
        } else {
          this.authError = 'Error occurred while logging in. Please try again later.';
        }
        this.snackBar.open(this.authError, 'OK', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 4000
        });
      }
    );
  }
}
