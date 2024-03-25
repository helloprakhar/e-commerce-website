import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { LocalStorageService } from './local-storage.service';
@Injectable({
  providedIn: 'root',
})
export class GuardService implements CanActivate {
  constructor(
    private router: Router,
    private localStorage: LocalStorageService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const token = this.localStorage.getToken();
    const isAdmin = localStorage.getItem('userAdmin');

    if (token && isAdmin === 'true') {
      const tokenDecode = JSON.parse(atob(token.split('.')[1]));

      if (tokenDecode.isAdmin && !this._tokenExpired(tokenDecode.exp)) {
        return true;
      }
      this.router.navigate(['/']);
      return false;
    }
    this.router.navigate(['/']);
    return false;
  }

  private _tokenExpired(expiration: any): boolean {
    return Math.floor(new Date().getTime() / 1000) >= expiration;
  }
}
