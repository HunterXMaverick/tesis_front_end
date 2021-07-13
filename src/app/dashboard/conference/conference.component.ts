import { Component, OnInit } from '@angular/core';
import { PostulationService } from '../../services/postulation.service';
import { ConferenceService } from '../../services/conference.service';

@Component({
  selector: 'app-conference',
  templateUrl: './conference.component.html',
  styleUrls: ['./conference.component.scss'],
})
export class ConferenceComponent implements OnInit {
  dataUser: any = [];
  postulationData: any = [];
  conferences: any = [];

  constructor(
    private postulationService: PostulationService,
    private conferenceService: ConferenceService
  ) {
    this.dataUser = JSON.parse(sessionStorage.getItem('_user-data')!);
    this.getConferences();
  }

  ngOnInit(): void {
    this.handleModal(false);
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
      res.data.forEach((element: any) => {
        if (element.reviewer_id === this.dataUser['_id']) {
          this.conferences.push(element);
        } else {
          this.conferences = null;
        }
      });
    });
  }

  handleModal(showModal: boolean) {
    let modal: any = document.getElementById('modal');

    if (showModal) {
      modal.classList.remove('hidden');
    } else {
      modal.classList.add('hidden');
    }
  }
}
