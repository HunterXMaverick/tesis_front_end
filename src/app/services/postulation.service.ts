import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {WebService} from "./web.service";

@Injectable({
  providedIn: 'root'
})
export class PostulationService {
  private url: string;

  constructor(
    private http: HttpClient,
    private server: WebService,
  ) {
    this.url = this.server.obtainUrl();
  }

  getPostulations() {
    return this.http.get(`${this.url}/getPostulations`, this.server.obtainHeaders())
  }

  postPostulation(postulation: object) {
    return this.http.post(`${this.url}/postPostulation`, postulation, this.server.obtainHeaders())
  }
}
