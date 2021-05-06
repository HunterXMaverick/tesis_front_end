import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {WebService} from './web.service';
import {Observable} from 'rxjs';
import {Data} from '../models/data';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private url: string;
  email: string;

  constructor(
    private http: HttpClient,
    private server: WebService,
  ) {
    this.url = this.server.obtainUrl();
  }

  login(dataLogin: { person: { password: any; email: any; }; }): Observable<Data> {
    this.email = dataLogin.person.email
    return this.http.post<Data>(`${this.url}/login`, dataLogin);
  }

  postPerson(person: object) {
    return this.http.post(`${this.url}/postPerson`, person);
  }

  putPerson(id: string, person: object) {
    return this.http.put(`${this.url}/putPerson/${id}`, person, this.server.obtainHeaders())
  }

  getUserById(id: string) {
    return this.http.get(`${this.url}/getPersonById/${id}`, this.server.obtainHeaders());
  }

  getUserByEmail(email: string) {
    return this.http.get(`${this.url}/getPersonByEmail/${email}`)
  }

  getUsers() {
    return this.http.get(`${this.url}/getPersons`, this.server.obtainHeaders())
  }

  disableEnablePerson(id: string, person: object) {
    return this.http.put(`${this.url}/disablePerson/${id}`, person, this.server.obtainHeaders());
  }
}
