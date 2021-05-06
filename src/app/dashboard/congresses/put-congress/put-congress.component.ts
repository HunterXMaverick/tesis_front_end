import {Component, OnInit} from '@angular/core';
import {CongressService} from '../../../services/congress.service';
import {Congress} from '../../../models/congress';
import {Router} from '@angular/router';
import Swal from "sweetalert2";

@Component({
  selector: 'app-put-congress',
  templateUrl: './put-congress.component.html',
  styleUrls: ['./put-congress.component.scss']
})
export class PutCongressComponent implements OnInit {

  congress: any = []
  today = new Date().toISOString().split("T")[0];

  modelCongress: Congress = {
    name: '',
    address_web: '',
    start_date: '',
    end_date: '',
    regulations: '',
    capacity_speakers: 0,
    capacity_participants: 0,
    status_congress: true
  }

  constructor(
    private congressService: CongressService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.getCongress()
  }

  getCongress() {
    return this.congressService.getCongress().subscribe(
      res => {
        this.congress = res;
        this.modelCongress.name = this.congress.congress[0].name;
        this.modelCongress.address_web = this.congress.congress[0].address_web;
        this.modelCongress.start_date = this.congress.congress[0].start_date;
        this.modelCongress.end_date = this.congress.congress[0].end_date;
        this.modelCongress.regulations = this.congress.congress[0].regulations;
        this.modelCongress.capacity_speakers = this.congress.congress[0].capacity_speakers;
        this.modelCongress.capacity_participants = this.congress.congress[0].capacity_participants;
        this.modelCongress.status_congress = this.congress.congress[0].status_congress;
        let separatorSD = this.modelCongress.start_date.split('T')
        let separatorED = this.modelCongress.end_date.split('T')
        this.modelCongress.start_date = separatorSD[0]
        this.modelCongress.end_date = separatorED[0]
      },
      err => console.error(err)
    )
  }

  putCongress(idCongress) {
    if (this.modelCongress.name && this.modelCongress.address_web && this.modelCongress.start_date && this.modelCongress.end_date && this.modelCongress.regulations && this.modelCongress.capacity_speakers > 0 && this.modelCongress.capacity_participants > 0) {
      this.modelCongress.start_date = this.modelCongress.start_date + 'T10:00:00.000+00:00'
      this.modelCongress.end_date = this.modelCongress.end_date + 'T15:00:00.000+00:00'
      let dataCongress = {
        congress: this.modelCongress
      }
      this.congressService.putCongress(idCongress, dataCongress)
        .subscribe(
          res => {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Actualización exitosa',
              showConfirmButton: false,
              timer: 1500
            });
            this.router.navigate(['/dashboard/congresses']);
          },
          err => {
            console.error(err);
          }
        );
    } else {
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: 'Debes completar todos los datos',
        showConfirmButton: false,
        timer: 1500
      });
    }
  }
}
