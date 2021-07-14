import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WebService } from './web.service';

@Injectable({
  providedIn: 'root',
})
export class AssignmentService {
  private url: string;

  constructor(private http: HttpClient, private server: WebService) {
    this.url = server.obtainUrl();
  }

  getAssignments() {
    return this.http.get(
      `${this.url}/getAssigments`,
      this.server.obtainHeaders()
    );
  }
    getAssignmentsName(reviewer_name: string) {
    return this.http.get(
      `${this.url}/getAssigmentsByReviewer/${reviewer_name}`,
      this.server.obtainHeaders()
    );
  }

  deleteAssignment(id: string) {
    return this.http.put(
      `${this.url}/deleteAssigment/${id}`,
      this.server.obtainHeaders()
    );
  }

  postAssignment(assignment: object) {
    return this.http.post(
      `${this.url}/postAssigment`,
      assignment,
      this.server.obtainHeaders()
    );
  }
}
