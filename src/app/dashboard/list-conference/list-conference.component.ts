import { Component, OnInit } from '@angular/core';
import { PostulationService } from '../../services/postulation.service';
import { ConferenceService } from '../../services/conference.service';
// import { PersonService } from '../../services/person.service';

@Component({
  selector: 'app-list-conference',
  templateUrl: './list-conference.component.html',
  styleUrls: ['./list-conference.component.scss']
})
export class ListConferenceComponent implements OnInit {
  dataUser: any = [];
  postulationData: any = [];
  postulations: any = [];
  conferences: any = [];
  // userById: any = [];
  // personId: any;
  // userData: any = '';
  // profile_picture_url: string = '';
  

  constructor(
    private postulationService: PostulationService,
    private conferenceService: ConferenceService,
    // private personService: PersonService
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

  // getUserById(id: string) {
  //   return this.personService.getUserById(id).subscribe(
  //     res => {
  //       this.userById.push(res)
  //     },
  //     err => console.error(err)
  //   )
  // }

  // getUserId(id: string) {
  //   this.personId = id;
  // }
}
