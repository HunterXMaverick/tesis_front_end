import { Component, OnInit } from '@angular/core';
import { PostulationService } from '../../services/postulation.service';
import { PersonService } from '../../services/person.service';

@Component({
  selector: 'app-list-postulation',
  templateUrl: './list-postulation.component.html',
  styleUrls: ['./list-postulation.component.scss']
})
export class ListPostulationComponent implements OnInit {
  dataUser: any = [];
  postulationData: any = [];
  postulations: any = [];

  userById: any = [];
  personId: any;
  projectsSpeaker: any = [];
  userData: any = '';

  constructor(
    private personService: PersonService,
    private postulationService: PostulationService
  ) {
    this.dataUser = JSON.parse(sessionStorage.getItem('_user-data')!);
  }

  ngOnInit(): void {

  }

  // getPostulation(postulation_id: string) {
  //   return this.postulationService.getPostulations().subscribe((res: any) => {
  //     res.data.forEach((element: any) => {
  //       if (element._id == postulation_id) {
  //         this.postulationData = element;
  //       }
  //     });
  //   });
  // }

  getPostulation() {
    return this.postulationService.getPostulations().subscribe(
      (res: any) => {
        this.postulations = res.data;
        this.postulations.postulations.forEach((element: any) => {
          this.getUserById(element.person_id)
          if(element.person_id == this.dataUser.person_id){
            this.projectsSpeaker.push(element)
          }
        });
      }
    )
  }


  getUserById(id: string) {
    return this.personService.getUserById(id).subscribe(
      (res: any) => {
        this.userById.push(res.data);
        this.userData = res.data;
      },
      (err) => console.error(err)
    );
  }
}
