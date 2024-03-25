import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserServiceService } from 'src/app/services/user-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  signupForm!: FormGroup;
  isSubmitted = false;
  hide = true;
  constructor(
    private formBuilder: FormBuilder,
    private authService: UserServiceService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.signupForm = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z\s]*$/),
          Validators.minLength(3),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      address: ['', Validators.required],
    });
  }
  onSubmit(): void {
    if (this.signupForm.invalid) {
      return;
    }

    const name = this.signupForm.get('name').value;
    const email = this.signupForm.get('email').value;
    const password = this.signupForm.get('password').value;
    const address = this.signupForm.get('address').value;

    this.isSubmitted = true;

    this.authService.signup(name, email, password, address).subscribe(
      (user: User) => {
        this.snackBar.open('User registered Successfully', 'OK', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 4000,
        });
        this.router.navigate(['/users/login']);
      },
      (error) => {
        if (error.status === 409) {
          this.snackBar.open('User with this email already exists', 'OK', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 4000,
          });
        } else {
          this.snackBar.open(
            'Error occurred while registering the user',
            'OK',
            {
              horizontalPosition: 'right',
              verticalPosition: 'top',
              duration: 4000,
            }
          );
        }
      }
    );
  }
}

