import { Component, OnInit } from '@angular/core';
import { PostulationService } from '../../services/postulation.service';
import { PostulationPasticipantsService } from '../../services/postulationPasticipants.service';
@Component({
  selector: 'app-list-postulation',
  templateUrl: './list-postulation.component.html',
  styleUrls: ['./list-postulation.component.scss'],
})
export class ListPostulationComponent implements OnInit {
  postulations: any = [];
  congressSelected: any;
  dataUser: any = [];
  postulationData: any = [];

  constructor(private postulationParticipantsService: PostulationPasticipantsService,  private postulationService: PostulationService,) {
    this.congressSelected = sessionStorage.getItem('activeCongress');
    this.dataUser = JSON.parse(sessionStorage.getItem('_user-data')!);
    this.getPostulations();

  }

  ngOnInit(): void {
    this.handleModal(false);
  }
  handleModal(showModal: boolean) {
    let modal: any = document.getElementById('modal');

    if (showModal) {
      modal.classList.remove('hidden');
    } else {
      modal.classList.add('hidden');
    }
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
  getPostulations() {
    return this.postulationParticipantsService.getPostulationParticipantsController().subscribe(
      (res: any) => {
        res.data.forEach((element: any) => {
        
          if (
            this.dataUser._id == element.person_id && 
            element.status == 'Aprobado' &&
            element.congress_id == this.congressSelected
          ) {
            this.postulations.push(element);
            console.log(element);
          }
        });
      },
      (err:any) => console.error(err)
    );
  }
}
