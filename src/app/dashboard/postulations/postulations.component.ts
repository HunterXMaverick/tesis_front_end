import { Component, OnInit } from '@angular/core';
import { PostulationService } from '../../services/postulation.service';
import { PersonService } from '../../services/person.service';
import { FilesService } from 'src/app/services/files.service';

@Component({
  selector: 'app-postulations',
  templateUrl: './postulations.component.html',
  styleUrls: ['./postulations.component.scss'],
})
export class PostulationsComponent implements OnInit {
  postulations: any = [];
  userById: any = [];
  userData: any;
  personId: any;
  dataUser: any = [];
  projectsSpeaker: any = [];

  constructor(
    private postulationService: PostulationService,
    private personService: PersonService,
    private filesService: FilesService
  ) {
    this.dataUser = JSON.parse(sessionStorage.getItem('_user-data')!);
  }

  ngOnInit() {
    // this.getUserByEmail();
    this.getPostulations();
  }

  getUserById(id: string) {
    return this.personService.getUserById(id).subscribe(
      (res: any) => {
        this.userById.push(res.data);
        this.userData = res.data;
        console.log(this.userById);
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

  // getUserByEmail() {
  //   return this.personService
  //     .getUserByEmail(this.personService.email)
  //     .subscribe(
  //       (res: any) => {
  //         this.dataUser = res.data;
  //       },
  //       (err) => console.error(err)
  //     );
  // }

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

  public create(postulation:any): void {
    sessionStorage.setItem('postulationdata',(postulation._id));
  }
}
