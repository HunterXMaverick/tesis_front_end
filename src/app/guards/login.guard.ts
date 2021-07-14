import { Injectable, OnInit } from '@angular/core';
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

  constructor(
    private router: Router,
    private permissions: PermissionsService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    this.userLogin = this.permissions.obtainToken();
    if (this.userLogin) {
      return true;
    } else {
      sessionStorage.clear();
      this.router.navigate(['/login']);
      return false;
    }
  }
}
