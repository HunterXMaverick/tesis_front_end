import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WebService } from './web.service';

@Injectable({
  providedIn: 'root',
})
export class QualificationService {
  private url: string;
  email!: string;

  constructor(private http: HttpClient, private server: WebService) {
    this.url = this.server.obtainUrl();
  }

  postQualification(qualification: object) {
    return this.http.post(
      `${this.url}/postQualification`,
      qualification,
      this.server.obtainHeaders()
    );
  }
  getQualification() {
    return this.http.get(
      `${this.url}/getQualification`,
      this.server.obtainHeaders()
    );
  }
  putQualification(id: string, qualification: object) {
    return this.http.put(
      `${this.url}/putQualification/${id}`,
      qualification,
      this.server.obtainHeaders()
    );
  }

  getQualificationById(id: string) {
    return this.http.get(
      `${this.url}/getQualificationById/${id}`,
      this.server.obtainHeaders()
    );
  }
}
