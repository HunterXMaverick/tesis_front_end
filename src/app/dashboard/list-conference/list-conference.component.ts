import { Component, OnInit } from '@angular/core';
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
export class ListConferenceComponent implements OnInit {
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

  ngOnInit(): void {
    this.handleModal(false);
    this.handleModalSpeaker(false);
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
