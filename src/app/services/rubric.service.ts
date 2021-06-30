import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WebService } from './web.service';

@Injectable({
  providedIn: 'root',
})
export class RubricService {
  private url: string;
  email!: string;

  constructor(private http: HttpClient, private server: WebService) {
    this.url = this.server.obtainUrl();
  }

  postRubric(rubric: object) {
    return this.http.post(
      `${this.url}/postRubric`,
      rubric,
      this.server.obtainHeaders()
    );
  }

  putRubric(id: string, rubric: object) {
    return this.http.put(
      `${this.url}/putRubric/${id}`,
      rubric,
      this.server.obtainHeaders()
    );
  }

  getRubricById(id: string) {
    return this.http.get(
      `${this.url}/getRubricById/${id}`,
      this.server.obtainHeaders()
    );
  }

  getRubrics() {
    return this.http.get(`${this.url}/getRubrics`, this.server.obtainHeaders());
  }
}
