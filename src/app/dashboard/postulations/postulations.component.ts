import { Component, OnInit } from '@angular/core';
import { PostulationService } from '../../services/postulation.service';
import { PersonService } from '../../services/person.service';
import { AssignmentService } from '../../services/assignment';
import { FilesService } from 'src/app/services/files.service';
import { CongressService } from 'src/app/services/congress.service';
import Swal from 'sweetalert2';
import { QualificationService } from 'src/app/services/qualification';
import { Router } from '@angular/router';
import { RubricService } from 'src/app/services/rubric.service';

@Component({
  selector: 'app-postulations',
  templateUrl: './postulations.component.html',
  styleUrls: ['./postulations.component.scss'],
})
export class PostulationsComponent implements OnInit {
  congressEnabled: boolean = true;
  congressSelected: any;
  profile_picture_url: string = '';
  remarks: Array<any> = [];
  showPostulations: boolean = true;
  postulations: Array<any> = [];
  assignments: any = '';
  knowledge_areas: any = [];
  userById: any = [];
  userData: any = '';
  personId: any;
  dataUser: any = [];
  projectsSpeaker: any = [];
  names: any = '';
  last_names: any = '';
  page: number = 1;
  selected_knowledge_area: string = '';
  nameSpeakerTemp: string = '';
  knowledge_area: Array<string> = [];
  congress: any = [];

  constructor(
    private postulationService: PostulationService,
    private personService: PersonService,
    private filesService: FilesService,
    private assignmentService: AssignmentService,
    private congressService: CongressService,
    private qualificationService: QualificationService,
    private rubricService: RubricService,
    private router: Router
  ) {
    this.dataUser = JSON.parse(sessionStorage.getItem('_user-data')!);
    this.congressSelected = sessionStorage.getItem('activeCongress');
  }

  ngOnInit() {
    this.handleModal(false);
    this.handleModalRemark(false);
    this.getPostulations();
    this.getKnowledge();
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

  getKnowledge = () => {
    this.names = this.dataUser.names;
    this.last_names = this.dataUser.last_names;

    this.assignmentService
      .getAssignmentsName(`${this.last_names} ${this.names}`)
      .subscribe((result: any) => {
        if (result.data.length == 0) {
          this.assignments = null;
        } else {
          this.assignments = result.data[0].knowledge_area;

          this.postulationService
            .getPostulationsByknowledgeArea(this.assignments)
            .subscribe((knowledge: any) => {
              this.knowledge_areas = knowledge.data;
            });
        }
      });
  };

  getPostulations() {
    return this.postulationService.getPostulations().subscribe(
      (res: any) => {
        if (res.data.length == 0) {
          this.showPostulations = false;
        } else {
          res.data.forEach((element: any) => {
            this.getUserById(element.person_id);
            if (
              element.person_id == this.dataUser._id &&
              element.congress_id == this.congressSelected
            ) {
              this.postulations.push(element);
              this.projectsSpeaker.push(element);
            }
          });
          this.showPostulations = true;
        }
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

  public create(postulation: any): void {
    sessionStorage.setItem('postulationdata', postulation._id);
  }

  disableEnableSpeaker(id: string, status: boolean) {
    let dataSpeaker = {
      postulation: status,
    };

    this.postulationService
      .disableEnableSpeaker(id, dataSpeaker)
      .subscribe((res: any) => {
        if (res.ok == true) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Ponente Aceptado',
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Ponente Rechazado',
            showConfirmButton: false,
            timer: 1500,
          });
        }
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

  handleModalRemark(showModal: boolean) {
    let modal: any = document.getElementById('modal-remark');

    if (showModal) {
      modal.classList.remove('hidden');
    } else {
      modal.classList.add('hidden');
    }
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
    if (this.selected_knowledge_area == '') {
      return this.getPostulations();
    } else {
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

  getRemarkQualification(postulationID: string) {
    this.remarks = [];
    let counter: number = 0;

    this.rubricService.getRubrics().subscribe((rubricResponse: any) => {
      rubricResponse.data[0].qualificationCriteria.forEach(
        (rubricElement: any) => {
          let data = {
            criteria: rubricElement,
          };

          this.remarks.push(data);
        }
      );
    });

    this.qualificationService.getQualification().subscribe(
      (qualificationResponse: any) => {
        qualificationResponse.data.forEach((element: any) => {
          if (element.postulation_id == postulationID) {
            element.remark.forEach((remarkElement: any) => {
              this.remarks[counter].remark = remarkElement;
              counter++;
            });
          }
        });
      },
      (error) => console.error(error)
    );
  }

  showGrade(id: string) {
    this.qualificationService.getQualification().subscribe((response: any) => {
      response.data.forEach((element: any) => {
        if (element.postulation_id == id) {
          Swal.fire({
            position: 'center',
            icon: 'info',
            title: `Su calificación final es: ${element.qualificaty}`,
            showConfirmButton: true,
            timer: 3000,
          });
        }
      });
    });
  }

  assignParticipants(postulation_id: string) {
    localStorage.setItem('postulation_id', postulation_id);
    this.router.navigate(['dashboard/assistants-participants']);
  }
}
