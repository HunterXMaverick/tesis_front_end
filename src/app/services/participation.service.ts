import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WebService } from './web.service';

@Injectable({
  providedIn: 'root'
})
export class ParticipationService {
  private url: string;

  constructor(private http: HttpClient, private server: WebService) {
    this.url = this.server.obtainUrl();
   }

   getParticipation(){
     return this.http.get(
       `${this.url}/getParticipation`,
       this.server.obtainHeaders()
     );
   }

   postParticipation(participation: object){
     return this.http.post(
       `${this.url}/postParticipation`,
       participation,
       this.server.obtainHeaders()
     );
   }
}
