import { Component, OnInit } from '@angular/core';
import { PostulationService } from '../../services/postulation.service';
import { PersonService } from '../../services/person.service';
import { FilesService } from 'src/app/services/files.service';
import { CongressService } from 'src/app/services/congress.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-topics',
  templateUrl: './list-topics.component.html',
  styleUrls: ['./list-topics.component.scss'],
})
export class ListTopicsComponent implements OnInit {
  postulations: any = [];
  userById: any = [];
  userData: any;
  personId: any;
  dataUser: any = [];
  projectsSpeaker: any = [];
  knowledge_area: Array<string> = [];
  congress: any = [];
  selected_knowledge_area: string = '';

  constructor(
    private postulationService: PostulationService,
    private personService: PersonService,
    private congressService: CongressService,
    private filesService: FilesService
  ) {
    this.dataUser = JSON.parse(sessionStorage.getItem('_user-data')!);
  }

  ngOnInit(): void {
    this.getPostulations();
    this.getCongress();
  }

  getUserById(id: string) {
    return this.personService.getUserById(id).subscribe(
      (res: any) => {
        this.userById.push(res.data);
        this.userData = res.data;
        console.log(this.userData);
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
            console.log(this.projectsSpeaker);
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
}
