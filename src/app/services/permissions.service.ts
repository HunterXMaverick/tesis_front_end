import {Injectable} from '@angular/core';
import {Data} from '../models/data';
import {Person} from '../models/person';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  data: Data;
  private token: string;
  private personLogin: Person;
  private rol: string;

  constructor() {
    this.token = null;
    this.personLogin = null;
  }

  decodeTokenRol(token: string): boolean {
    const decoded = jwt_decode(token);
    if (decoded) {
      this.token = token || null;
      this.personLogin = decoded || null;
      this.rol = this.personLogin.rol;
      return true;
    } else {
      return false;
    }
  }

  decodeToken(token: string): boolean {
    const decoded = jwt_decode(token);
    if (decoded) {
      this.token = token || null;
      this.personLogin = decoded.email || null;
      return true;
    } else {
      return false;
    }
  }

  public isAuthenticated(): boolean {
    return this.token === null;
  }

  obtainToken(): string {
    return this.token;
  }

  destroyToken(): void {
    this.token = null;
  }

  obtainPersonLogin(): object {
    return this.personLogin;
  }

  obtainPersonRol(): string {
    return this.rol;
  }
}
