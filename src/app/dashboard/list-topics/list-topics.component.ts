import { Component, OnInit } from '@angular/core';
import { PostulationService } from '../../services/postulation.service';
import { PersonService } from '../../services/person.service';
import { FilesService } from 'src/app/services/files.service';
import { CongressService } from 'src/app/services/congress.service';
import { ParticipationService } from '../../services/participation.service';
import { Participation } from '../../models/participation';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PostulationPasticipantsService } from 'src/app/services/postulationPasticipants.service';

@Component({
  selector: 'app-list-topics',
  templateUrl: './list-topics.component.html',
  styleUrls: ['./list-topics.component.scss'],
})
export class ListTopicsComponent implements OnInit {
  congressEnabled: boolean = true;
  congressSelected: any;
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
    attend: '',
    person_id: '',
  };

  constructor(
    private postulationService: PostulationService,
    private personService: PersonService,
    private congressService: CongressService,
    private filesService: FilesService,
    private participation: ParticipationService,
    private postulationParticipantsService: PostulationPasticipantsService,
    private router: Router
  ) {
    this.dataUser = JSON.parse(sessionStorage.getItem('_user-data')!);
    this.congressSelected = sessionStorage.getItem('activeCongress');
  }

  ngOnInit(): void {
    this.handleModal(false);
    this.getPostulations();
    this.getCongress();
  }

  getUserById(id: string) {
    return this.personService.getUserById(id).subscribe(
      (res: any) => {
        this.userById.push(res.data);
        this.userData = res.data;
        if (res.data.profile_picture) {
          this.profile_picture_url = `http://localhost:3500/api/file/${res.data.profile_picture}`;
        } else {
          this.profile_picture_url =
            'https://upload.wikimedia.org/wikipedia/commons/7/72/Default-welcomer.png';
        }
      },
      (err) => console.error(err)
    );
  }

  getPostulations() {
    return this.postulationService.getPostulations().subscribe(
      (res: any) => {
        res.data.forEach((element: any) => {
          if (
            element.status == 'Aprobado' &&
            element.congress_id == this.congressSelected
          ) {
            this.postulations.push(element);
            this.getUserById(element.person_id);
            if (element.person_id == this.dataUser._id) {
              this.projectsSpeaker.push(element);
            }
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
        if (res.data.length == 0) {
          this.congress = null;
        } else {
          res.data.forEach((element: any) => {
            if (
              // element.person_id == this.dataUser._id &&
              element._id == this.congressSelected &&
              element.status_congress == 'Habilitado'
            ) {
              this.congress = element;
              this.congressEnabled = element.status_congress;
              this.knowledge_area = element.knowledge_area.split(',');
            }
          });
        }
      },
      (err) => console.error(err)
    );
  }

  getSpeakerName(id: string) {
    return this.personService.getUserById(id).subscribe(
      (res: any) => {
        this.nameSpeakerTemp = `${res.data.last_names} ${res.data.names}`;
      },
      (err) => console.error(err)
    );
  }

  getPostulationsByAreaOfKnowledge() {
    this.postulations = [];

    if (this.selected_knowledge_area == '') {
      return this.getPostulations();
    } else {
      return this.postulationService
        .getPostulationsByknowledgeArea(this.selected_knowledge_area)
        .subscribe(
          (res: any) => {
            res.data.forEach((element: any) => {
              if (element.status == 'Aprobado') {
                this.getSpeakerName(element.person_id);
                element.speakerName = this.nameSpeakerTemp;
                this.postulations.push(element);
              }
            });
          },
          (err) => console.error(err)
        );
    }
  }

  handleModal(showModal: boolean) {
    let modal: any = document.getElementById('modal');

    if (showModal) {
      modal.classList.remove('hidden');
    } else {
      modal.classList.add('hidden');
    }
  }

  postParticipation(postulation_id: string) {
    let person_id = JSON.parse(sessionStorage.getItem('_user-data')!)._id;

    this.postulationParticipantsService
      .getParticipantPostulationsLength(person_id)
      .subscribe((res: any) => {
        // if (res.data.length + 1 <= 2) {
        if (res.data.length == 0) {
          let postData = {
            postulationParticipants: {
              postulation_id,
              person_id,
              status: 'Pendiente',
              congress_id: this.congressSelected,
            },
          };

          this.postulationParticipantsService
            .postPostulationParticipants(postData)
            .subscribe(() => {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title:
                  'Se ha enviado su petición de participar en la ponencia, espere a su confirmación.',
                showConfirmButton: false,
                timer: 3000,
              });
            });
        } else {
          res.data.forEach((element: any) => {
            if (element.postulation_id == postulation_id) {
              Swal.fire({
                position: 'center',
                icon: 'info',
                title: 'Ya ha postulado en esta ponencia.',
                showConfirmButton: false,
                timer: 3000,
              });
            } else {
              let postData = {
                postulationParticipants: {
                  postulation_id,
                  person_id,
                  status: 'Pendiente',
                },
              };

              this.postulationParticipantsService
                .postPostulationParticipants(postData)
                .subscribe(() => {
                  Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title:
                      'Se ha recibido su petición de participar en la ponencia, espere a su confirmación.',
                    showConfirmButton: false,
                    timer: 3000,
                  });
                });
            }
          });
        }
        // } else {
        //   Swal.fire({
        //     position: 'center',
        //     icon: 'info',
        //     title: 'Solo puede postular en un máximo de dos ponencias.',
        //     showConfirmButton: false,
        //     timer: 3000,
        //   });
        // }
      });
  }
}
