import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {WebService} from './web.service';

@Injectable({
  providedIn: 'root'
})
export class LinksService {
  private url: string;

  constructor(
    private http: HttpClient,
    private server: WebService
  ) {
    this.url = server.obtainUrl();
  }

  getLinkById(id: string) {
    return this.http.get(`${this.url}/getLinkById/${id}`, this.server.obtainHeaders())
  }

  getLinks() {
    return this.http.get(`${this.url}/getLinks`, this.server.obtainHeaders());
  }

  postLink(link: object) {
    return this.http.post(`${this.url}/postLink`, link, this.server.obtainHeaders())
  }

  putLink(id: string, link: object) {
    return this.http.put(`${this.url}/putLink/${id}`, link, this.server.obtainHeaders())
  }

  deleteLink(id: string) {
    return this.http.delete(`${this.url}/deleteLink/${id}`, this.server.obtainHeaders())
  }
}