import { Component, OnInit } from '@angular/core';
import { PostulationService } from '../../services/postulation.service';
import { PersonService } from '../../services/person.service';
import { AssignmentService } from '../../services/assignment';
import { FilesService } from 'src/app/services/files.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-postulations',
  templateUrl: './postulations.component.html',
  styleUrls: ['./postulations.component.scss'],
})
export class PostulationsComponent implements OnInit {
  profile_picture_url: string = '';
  showPostulations: boolean = true;
  postulations: any = [];
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

  constructor(
    private postulationService: PostulationService,
    private personService: PersonService,
    private filesService: FilesService,
    private assignmentService: AssignmentService
  ) {
    this.dataUser = JSON.parse(sessionStorage.getItem('_user-data')!);
  }

  ngOnInit() {
    this.handleModal(false);
    this.getPostulations();
    this.getKnowledge();
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
              console.log(this.knowledge_areas);
            });
        }
      });
  };

  getPostulations() {
    return this.postulationService.getPostulations().subscribe(
      (res: any) => {
        this.postulations = res.data;
        if (this.postulations.length == 0) {
          this.showPostulations = false;
        } else {
          this.postulations.forEach((element: any) => {
            this.getUserById(element.person_id);
            if (element.person_id == this.dataUser._id) {
              this.projectsSpeaker.push(element);
              console.log(this.projectsSpeaker);
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

  handleModal(showModal: boolean) {
    let modal: any = document.getElementById('modal');

    if (showModal) {
      modal.classList.remove('hidden');
    } else {
      modal.classList.add('hidden');
    }
  }
}
