import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  apiURLUsers = environment.apiURL + 'users';
  private userLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public userLoggedIn$: Observable<boolean> = this.userLoggedInSubject.asObservable();
  private userUpdatedSubject: BehaviorSubject<void> = new BehaviorSubject<void>(null);
  public userUpdated$: Observable<void> = this.userUpdatedSubject.asObservable();
  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<{ token: string; user: string; isAdmin: boolean }> {
    return this.http.post<{ token: string; user: string; isAdmin: boolean }>(`${this.apiURLUsers}/login`, { email, password })
      .pipe(
        map(userInfo => {
          localStorage.setItem('user', userInfo.user);
          if (userInfo.isAdmin !== undefined) {
            localStorage.setItem('userAdmin', JSON.stringify(userInfo.isAdmin));
          } else {
            localStorage.setItem('userAdmin', JSON.stringify(false));
          }
          this.userLoggedInSubject.next(true);
          this.router.navigate(['/']);
          return userInfo;
        })
      );
  }

  signup(name: string, email: string, password: string, address: string, isAdmin?: boolean): Observable<User> {
    return this.http.post<User>(`${this.apiURLUsers}/register`, { name, email, password, address, isAdmin });
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiURLUsers);
  }

  getOneUser(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiURLUsers}/${userId}`);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiURLUsers}/register`, user);
  }

  updateUser(user: User, userId: string): Observable<User> {
    return this.http.put<User>(`${this.apiURLUsers}/${userId}`, user)
      .pipe(
        tap(() => {
          this.userUpdatedSubject.next();
        })
      );
  }

  deleteUser(userId: string): Observable<User> {
    return this.http.delete<User>(`${this.apiURLUsers}/${userId}`);
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('userAdmin');
    this.userLoggedInSubject.next(false);
    this.router.navigate(['/users/login']);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('user') !== null;
  }

  isAdmin(): boolean {
    const isAdmin = localStorage.getItem('userAdmin');
    return isAdmin === 'true';
  }
  
}
