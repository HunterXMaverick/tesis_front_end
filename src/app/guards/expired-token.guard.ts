import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivate} from '@angular/router';
import {Observable} from 'rxjs';
import {WebService} from '../services/web.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ExpiredTokenGuard implements CanActivate {

  isTokenAuth: any;

  constructor(
    private router: Router,
    private server: WebService
  ) {
    this.isTokenAuth = this.server.obtainHeaders();
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.isTokenAuth.headers.Authorization) {
      return true;
    } else {
      this.router.navigate(['/login']);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Token Expirado',
        showConfirmButton: false,
        timer: 1500
      });
    }
  }

}
