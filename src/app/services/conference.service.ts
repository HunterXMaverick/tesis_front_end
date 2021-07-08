import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { WebService } from "./web.service";

@Injectable({
  providedIn: 'root'
})
export class ConferenceService {
  private url: string;

  constructor(private http: HttpClient, private server: WebService) {
    this.url = server.obtainUrl();
  }

  getConference() {
    return this.http.get(
      `${this.url}/getConference`,
      this.server.obtainHeaders()
    );
  }

  putConference(id: string, conference: object) {
    return this.http.put(
      `${this.url}/putConference`,
      conference,
      this.server.obtainHeaders()
    );
  }

  postConference(conference: object) {
    return this.http.post(
      `${this.url}/postConference`,
      conference,
      this.server.obtainHeaders()
    );
  }
}
