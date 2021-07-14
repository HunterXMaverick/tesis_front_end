import { Component, OnInit } from '@angular/core';
import { PostulationService } from '../../services/postulation.service';
import { ConferenceService } from '../../services/conference.service';
import { PersonService } from 'src/app/services/person.service';
// import { PersonService } from '../../services/person.service';

@Component({
  selector: 'app-list-conference',
  templateUrl: './list-conference.component.html',
  styleUrls: ['./list-conference.component.scss'],
})
export class ListConferenceComponent implements OnInit {
  profile_picture_url: string = '';
  dataUser: any = [];
  postulationData: any = [];
  postulations: any = [];
  conferences: any = [];
  // userById: any = [];
  // personId: any;
  userData: any = '';
  // profile_picture_url: string = '';

  constructor(
    private postulationService: PostulationService,
    private conferenceService: ConferenceService,
    private personService: PersonService
  ) {
    this.dataUser = JSON.parse(sessionStorage.getItem('_user-data')!);
    this.getConferences();
  }

  ngOnInit(): void {
    this.handleModal(false);
    this.handleModalSpeaker(false);
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
      this.conferences = res.data;
      console.log(this.conferences);
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

  handleModalSpeaker(showModal: boolean) {
    let modal: any = document.getElementById('modal-speaker');

    if (showModal) {
      modal.classList.remove('hidden');
    } else {
      modal.classList.add('hidden');
    }
  }

  getUserById(id: string) {
    return this.personService.getUserById(id).subscribe(
      (res: any) => {
        this.userData = res.data;
        this.profile_picture_url = `http://localhost:3500/api/file/${res.data.profile_picture}`;
      },
      (err) => console.error(err)
    );
  }
}
