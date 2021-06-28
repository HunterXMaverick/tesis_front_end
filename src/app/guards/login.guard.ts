import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
  CanActivate,
} from '@angular/router';
import { Observable } from 'rxjs';
import { PermissionsService } from '../services/permissions.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  userLogin: any;

  constructor(private router: Router, private permissions: PermissionsService) {
<<<<<<< HEAD
    this.userLogin = this.permissions.obtainPersonLogin();
=======
    this.userLogin = this.permissions.obtainToken();
>>>>>>> 48ed258a0a659d085a67dcac3a07dbc4ec1b9712
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.userLogin) {
      return true;
    } else {
      sessionStorage.clear();
      this.router.navigate(['/login']);
      return false;
    }
  }
}
