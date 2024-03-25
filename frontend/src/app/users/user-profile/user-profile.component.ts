import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../../services/user-service.service';
import { User } from 'src/app/models/user';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  user: User;
  userId: string;
  welcomeMessage: string;
  currentTime: string;

  constructor(
    private userService: UserServiceService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('user');
    this.getUserProfile();
    this.setWelcomeMessage();
  }

  getUserProfile(): void {
    if (this.userId) {
      this.userService.getOneUser(this.userId).subscribe(
        (user) => {
          this.user = user;
        },
        (error) => {
          console.log('Error retrieving user profile:', error);
        }
      );
    }
  }

  setWelcomeMessage(): void {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const amPM = currentHour >= 12 ? 'PM' : 'AM';
    const twelveHourFormat = currentHour % 12 || 12;
    const formattedTime = `${twelveHourFormat}:${currentMinute
      .toString()
      .padStart(2, '0')} ${amPM}`;

    if (currentHour >= 5 && currentHour < 12) {
      this.welcomeMessage = 'Good morning!';
    } else if (currentHour >= 12 && currentHour < 17) {
      this.welcomeMessage = 'Good afternoon!';
    } else {
      this.welcomeMessage = 'Good evening!';
    }

    this.currentTime = `Current time: ${formattedTime}`;
  }

  forwardToForm() {
    this.router.navigate(['user/profile-edit', this.userId]);
  }
  forwardToOrder() {
    this.router.navigate(['cart/user']);
  }

  backToShop() {
    this.router.navigateByUrl('/');
  }
}
