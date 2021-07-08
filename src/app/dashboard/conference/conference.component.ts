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
  }

  getPostulation() {
    return this.postulations.getPostulations().subscribe(
      (res: any) => {
        this.postulations = res.data;
      });
  }

}
