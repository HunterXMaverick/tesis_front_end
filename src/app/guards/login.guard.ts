import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
  CanActivate,
} from "@angular/router";
import { Observable } from "rxjs";
import { PermissionsService } from "../services/permissions.service";

@Injectable({
  providedIn: "root",
})
export class LoginGuard implements CanActivate {
  userLogin: any;

  constructor(private router: Router, private permissions: PermissionsService) {
    // this.userLogin = this.permissions.obtainPersonLogin();

    let sessionToken: string = sessionStorage.getItem("_token");
    if (
      sessionToken !== "" &&
      sessionToken !== null &&
      sessionToken !== undefined
    ) {
      this.userLogin = true;
    } else {
      this.userLogin = false;
    }
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
      this.router.navigate(["/login"]);
    }
  }
}
