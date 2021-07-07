import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WebService } from './web.service';

@Injectable({
  providedIn: 'root',
})
export class PostulationPasticipantsService {
  private url: string;
  email!: string;

  constructor(private http: HttpClient, private server: WebService) {
    this.url = this.server.obtainUrl();
  }

  postPostulationParticipants(PostulationParticipants: object) {
    return this.http.post(
      `${this.url}/postPostulationParticipants`,
      PostulationParticipants,
      this.server.obtainHeaders()
    );
  }
  getPostulationParticipantsController() {
    return this.http.get(
      `${this.url}/getPostulationParticipantsController`,
      this.server.obtainHeaders()
    );
  }
  putPostulationParticipants(id: string, PostulationParticipants: object) {
    return this.http.put(
      `${this.url}/putPostulationParticipants/${id}`,
      PostulationParticipants,
      this.server.obtainHeaders()
    );
  }

  getPostulationParticipantsById(id: string) {
    return this.http.get(
      `${this.url}/getPostulationParticipantsById/${id}`,
      this.server.obtainHeaders()
    );
  }
}
