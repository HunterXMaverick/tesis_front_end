import { Component } from '@angular/core';
import { PostulationService } from '../../services/postulation.service';
import { ConferenceService } from '../../services/conference.service';
import { PersonService } from 'src/app/services/person.service';
import { PostulationPasticipantsService } from 'src/app/services/postulationPasticipants.service';
// import { PersonService } from '../../services/person.service';

@Component({
  selector: 'app-list-conference',
  templateUrl: './list-conference.component.html',
  styleUrls: ['./list-conference.component.scss'],
})
export class ListConferenceComponent {
  profile_picture_url: string = '';
  dataUser: any = [];
  postulationData: any = [];
  postulations: any = [];
  conferences: Array<any> = [];
  congressSelected: any;
  // userById: any = [];
  // personId: any;
  userData: any = '';
  // profile_picture_url: string = '';
  showModal: boolean = false;
  showModalSpeaker: boolean = false;

  constructor(
    private postulationService: PostulationService,
    private conferenceService: ConferenceService,
    private postulationParticipantService: PostulationPasticipantsService,
    private personService: PersonService
  ) {
    this.dataUser = JSON.parse(sessionStorage.getItem('_user-data')!);
    this.congressSelected = sessionStorage.getItem('activeCongress');
    this.getPostulationParticipantService();
  }

  getPostulationParticipantService() {
    return this.postulationParticipantService
      .getPostulationParticipantsController()
      .subscribe((res: any) => {
        if (this.dataUser.rol == 'Organizador') {
          this.getAllConferences();
        } else {
          res.data.forEach((element: any) => {
            if (element.person_id == this.dataUser._id) {
              if (element.status == 'Aprobado') {
                this.getConferences(element.postulation_id);
              }
            }
          });
        }
      });
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

  getConferences(postulation_id: string) {
    return this.conferenceService.getConference().subscribe((res: any) => {
      res.data.forEach((element: any) => {
        if (
          element.congress_id == this.congressSelected &&
          element.postulation_id == postulation_id
        ) {
          this.conferences.push(element);
        }
      });
    });
  }

  getAllConferences() {
    return this.conferenceService.getConference().subscribe((res: any) => {
      res.data.forEach((element: any) => {
        if (element.congress_id == this.congressSelected) {
          this.conferences.push(element);
        }
      });
    });
  }

  handleModal(showModal: boolean) {
    this.showModal = showModal;
  }

  handleModalSpeaker(showModal: boolean) {
    this.showModalSpeaker = showModal;
  }

  getUserById(id: string) {
    return this.personService.getUserById(id).subscribe(
      (res: any) => {
        this.userData = res.data;
        if (res.data.profle_picture) {
          this.profile_picture_url = `http://localhost:3500/api/file/${res.data.profile_picture}`;
        } else {
          this.profile_picture_url =
            'https://upload.wikimedia.org/wikipedia/commons/7/72/Default-welcomer.png';
        }
      },
      (err) => console.error(err)
    );
  }
}
