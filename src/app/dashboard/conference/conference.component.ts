import { Component } from '@angular/core';
import { PostulationService } from '../../services/postulation.service';
import { ConferenceService } from '../../services/conference.service';

@Component({
  selector: 'app-conference',
  templateUrl: './conference.component.html',
  styleUrls: ['./conference.component.scss'],
})
export class ConferenceComponent {
  dataUser: any = [];
  postulationData: any = [];
  conferences: any = [];
  congressSelected: any;
  showModal: boolean = false;

  constructor(
    private postulationService: PostulationService,
    private conferenceService: ConferenceService
  ) {
    this.dataUser = JSON.parse(sessionStorage.getItem('_user-data')!);
    this.congressSelected = sessionStorage.getItem('activeCongress');
    this.getConferences();
  }

  getPostulation(postulation_id: string) {
    return this.postulationService.getPostulations().subscribe((res: any) => {
      res.data.forEach((element: any) => {
        if (element._id == postulation_id) {
          this.postulationData = element;
        }
      });
    });
  }

  getConferences() {
    return this.conferenceService.getConference().subscribe((res: any) => {
      this.conferences = [];

      res.data.forEach((element: any) => {
        if (
          element.reviewer_id === this.dataUser['_id'] &&
          element.congress_id == this.congressSelected
        ) {
          this.conferences.push(element);
        }
      });
    });
  }

  handleModal(showModal: boolean) {
    this.showModal = showModal;
  }
}
