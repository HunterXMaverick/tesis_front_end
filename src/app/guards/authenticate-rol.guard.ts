import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {PermissionsService} from '../services/permissions.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateRolGuard implements CanActivate {

  rol: any;

  constructor(public permissions: PermissionsService, public router: Router) {
  }

  canActivate() {
    this.rol = this.permissions.obtainPersonRol()
    if (this.rol != 'Administrador') {
      console.log('Usted no puede ingresar')
      this.router.navigate(['/home'])
    } else {
      return true;
    }
  }
}
