import { Component } from '@angular/core';
import { CongressService } from '../../../services/congress.service';
import { Congress } from '../../../models/congress';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-put-congress',
  templateUrl: './put-congress.component.html',
  styleUrls: ['./put-congress.component.scss'],
})
export class PutCongressComponent {
  public Editor = ClassicEditor;
  congressSelected: any;
  congress: any = [];
  today = new Date().toISOString().split('T')[0];

  modelCongress: Congress = {
    name: '',
    address_web: '',
    start_date: '',
    end_date: '',
    regulations: '',
    capacity_speakers: 0,
    capacity_participants: 0,
    knowledge_area: '',
    status_congress: '',
    person_id: '',
  };

  constructor(
    private congressService: CongressService,
    private router: Router
  ) {
    this.congressSelected = sessionStorage.getItem('activeCongress');
    this.getCongress();
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

              this.modelCongress.name = element.name;
              // this.modelCongress.address_web = element.address_web;
              this.modelCongress.start_date = element.start_date;
              this.modelCongress.end_date = element.end_date;
              this.modelCongress.regulations = element.regulations;
              this.modelCongress.capacity_speakers = element.capacity_speakers;
              this.modelCongress.capacity_participants =
                element.capacity_participants;
              this.modelCongress.knowledge_area = element.knowledge_area;
              this.modelCongress.status_congress = element.status_congress;
              let separatorSD = element.start_date.split('T');
              let separatorED = element.end_date.split('T');
              this.modelCongress.start_date = separatorSD[0];
              this.modelCongress.end_date = separatorED[0];
              this.modelCongress.status_congress = element.status_congress;
              this.modelCongress.person_id = element.person_id;
            }
          });
        }
      },
      (err) => console.error(err)
    );
  }

  putCongress(idCongress: any) {
    if (
      this.modelCongress.name &&
      // this.modelCongress.address_web &&
      this.modelCongress.start_date &&
      this.modelCongress.end_date &&
      this.modelCongress.regulations &&
      this.modelCongress.knowledge_area &&
      this.modelCongress.capacity_speakers > 0 &&
      this.modelCongress.capacity_participants > 0
    ) {
      this.modelCongress.start_date =
        this.modelCongress.start_date + 'T10:00:00.000+00:00';
      this.modelCongress.end_date =
        this.modelCongress.end_date + 'T15:00:00.000+00:00';

      let dataCongress = {
        congress: this.modelCongress,
      };

      this.congressService.putCongress(idCongress, dataCongress).subscribe(
        (res) => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Congreso actualizado correctamente.',
            showConfirmButton: false,
            timer: 1500,
          }).then(() => this.router.navigate(['/dashboard/congresses']));
        },
        (err) => {
          console.error(err);
        }
      );
    } else {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Completa todos los campos para continuar.',
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }
}
