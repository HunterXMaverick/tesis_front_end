import { Component } from '@angular/core';
import { CongressService } from '../../../services/congress.service';
import { Congress } from '../../../models/congress';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-create-congress',
  templateUrl: './create-congress.component.html',
  styleUrls: ['./create-congress.component.scss'],
})
export class CreateCongressComponent {
  public Editor = ClassicEditor;
  dataUser: any;
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
    status_congress: 'Pendiente',
    person_id: '',
  };

  constructor(
    private congressService: CongressService,
    private router: Router
  ) {
    this.dataUser = JSON.parse(sessionStorage.getItem('_user-data')!);
  }

  postCongress() {
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
      this.modelCongress.person_id = this.dataUser._id;

      let dataCongress = {
        congress: this.modelCongress,
      };

      this.congressService.postCongress(dataCongress).subscribe(
        (res) => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Congreso creado exitosamente.',
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            Swal.fire({
              position: 'center',
              icon: 'info',
              title:
                'Su congreso está guardado con el estado PENDIENTE de aprobación.',
              showConfirmButton: false,
              timer: 3000,
            }).then(() => this.router.navigate(['/dashboard/congresses']));
          });
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
        timer: 1500,
      });
    }
  }
}
