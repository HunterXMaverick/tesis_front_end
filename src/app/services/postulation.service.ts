import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WebService } from './web.service';

@Injectable({
  providedIn: 'root',
})
export class PostulationService {
  private url: string;

  constructor(private http: HttpClient, private server: WebService) {
    this.url = this.server.obtainUrl();
  }

  getPostulations() {
    return this.http.get(
      `${this.url}/getPostulations`,
      this.server.obtainHeaders()
    );
  }

  getPostulationsByknowledgeArea(knowledge_area: string) {
    return this.http.get(
      `${this.url}/knowledgeByArea/${knowledge_area}`,
      this.server.obtainHeaders()
    );
  }
  postPostulation(postulation: object) {
    return this.http.post(
      `${this.url}/postPostulation`,
      postulation,
      this.server.obtainHeaders()
    );
  }

  disableEnableSpeaker(id: string, postulation: object) {
    return this.http.put(
      `${this.url}/disableSpeaker/${id}`,
      postulation,
      this.server.obtainHeaders()
    );
  }

  putPostulation(id: string, postulation: object) {
    return this.http.put(
      `${this.url}/putPostulation/${id}`,
      postulation,
      this.server.obtainHeaders()
    );
  }
}
