import { Component, OnInit } from '@angular/core';
import { PostulationService } from '../../services/postulation.service';
import { ConferenceService } from '../../services/conference.service';


@Component({
  selector: 'app-conference',
  templateUrl: './conference.component.html',
  styleUrls: ['./conference.component.scss']
})
export class ConferenceComponent implements OnInit {
  postulations: any = [];
  conference: any = [];

  constructor(
    private postulationService: PostulationService,
    private conferenceService: ConferenceService) {
  }

  ngOnInit(): void {
    this.getPostulation();
  }

  getPostulation() {
    return this.postulations.getPostulations().subscribe(
      (res: any) => {
        this.postulations = res.data;
      });
  }

  getConference() {
    return this.conferenceService.getConference().subscribe(
      (res: any) => {
        if (res.data.length == 0) {
          this.conference = null;
        } else if (res.data.length >= 1) {
          this.conference = res.data[0];
        }
      },
      (err) => console.error(err)
    );
  }

}
