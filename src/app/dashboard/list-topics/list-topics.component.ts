import { Component, OnInit } from '@angular/core';
import { PostulationService } from '../../services/postulation.service';
import { PersonService } from '../../services/person.service';
import { FilesService } from 'src/app/services/files.service';
import { CongressService } from 'src/app/services/congress.service';
import { ParticipationService } from '../../services/participation.service';
import { Participation } from '../../models/participation'
import { Router } from "@angular/router";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-topics',
  templateUrl: './list-topics.component.html',
  styleUrls: ['./list-topics.component.scss'],
})
export class ListTopicsComponent implements OnInit {
  profile_picture_url: string = '';
  postulations: any = [];
  userById: any = [];
  userData: any;
  personId: any;
  dataUser: any = [];
  projectsSpeaker: any = [];
  knowledge_area: Array<string> = [];
  congress: any = [];
  selected_knowledge_area: string = '';
  nameSpeakerTemp: string = '';
  page: number = 1;

  modelParticipation: Participation = {
    attend: "",
    person_id: ""
  }

  constructor(
    private postulationService: PostulationService,
    private personService: PersonService,
    private congressService: CongressService,
    private filesService: FilesService,
    private participation: ParticipationService,
    private router: Router
  ) {
    this.dataUser = JSON.parse(sessionStorage.getItem('_user-data')!);
  }

  ngOnInit(): void {
    this.handleModal(false);
    this.getPostulations();
    this.getCongress();
    this.postParticipation();
  }

  getUserById(id: string) {
    return this.personService.getUserById(id).subscribe(
      (res: any) => {
        this.userById.push(res.data);
        this.userData = res.data;
        this.profile_picture_url = `http://localhost:3500/api/file/${res.data.profile_picture}`;
      },
      (err) => console.error(err)
    );
  }

  getPostulations() {
    return this.postulationService.getPostulations().subscribe(
      (res: any) => {
        this.postulations = res.data;
        this.postulations.forEach((element: any) => {
          this.getUserById(element.person_id);
          if (element.person_id == this.dataUser._id) {
            this.projectsSpeaker.push(element);
          }
        });
      },
      (err) => console.error(err)
    );
  }

  getUserId(id: string) {
    this.personId = id;
  }

  getFile(fileName: string) {
    let file = fileName.split('/');

    this.filesService
      .showFile(file[0], file[1])
      .then((response) => {
        window.open(response, '_blank');
      })
      .catch((error) => {
        console.error(error);
      });
  }

  disableEnableSpeaker(id: string, status: boolean) {
    let dataSpeaker = {
      postulation: status,
    };

    this.postulationService
      .disableEnableSpeaker(id, dataSpeaker)
      .subscribe((res) => {
        if (status == true) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Ponente Aceptado',
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Ponente Rechazado',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
  }

  getCongress() {
    return this.congressService.getCongress().subscribe(
      (res: any) => {
        this.congress = res.data[0];
        this.knowledge_area = this.congress.knowledge_area.split(',');
      },
      (err) => console.error(err)
    );
  }

  getSpeakerName(id: string) {
    return this.personService.getUserById(id).subscribe(
      (res: any) => {
        this.nameSpeakerTemp = `${res.data.last_names} ${res.data.names}`;
        // this.userById.push(res.data);
        // this.userData = res.data;
        // console.log(this.userData);
      },
      (err) => console.error(err)
    );
  }

  getPostulationsByAreaOfKnowledge() {
    return this.postulationService
      .getPostulationsByknowledgeArea(this.selected_knowledge_area)
      .subscribe(
        (res: any) => {
          this.postulations = [];

          res.data.forEach((element: any) => {
            this.getSpeakerName(element.person_id);
            element.speakerName = this.nameSpeakerTemp;
            this.postulations.push(element);
          });
        },
        (err) => console.error(err)
      );
  }

  handleModal(showModal: boolean) {
    let modal: any = document.getElementById('modal');

    if (showModal) {
      modal.classList.remove('hidden');
    } else {
      modal.classList.add('hidden');
    }
  }

  postParticipation() {
    if (
      this.modelParticipation.attend &&
      this.modelParticipation.person_id
    ) {
      let dataParticipation = {
        participation: this.modelParticipation
      };

    
    }
  }
}
