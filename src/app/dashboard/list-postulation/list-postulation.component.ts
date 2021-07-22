import { Component, OnInit } from '@angular/core';
import { PostulationService } from '../../services/postulation.service';

@Component({
  selector: 'app-list-postulation',
  templateUrl: './list-postulation.component.html',
  styleUrls: ['./list-postulation.component.scss'],
})
export class ListPostulationComponent implements OnInit {
  postulations: any = [];
  congressSelected: any;

  constructor(private postulationService: PostulationService) {
    this.congressSelected = sessionStorage.getItem('activeCongress');
    this.getPostulations();
  }

  ngOnInit(): void {}

  getPostulations() {
    return this.postulationService.getPostulations().subscribe(
      (res: any) => {
        res.data.forEach((element: any) => {
          if (
            element.status == 'Aprobado' &&
            element.congress_id == this.congressSelected
          ) {
            this.postulations.push(element);
          }
        });
      },
      (err) => console.error(err)
    );
  }
}
