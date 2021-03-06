import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { CongressService } from '../../services/congress.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-congresses',
  templateUrl: './congresses.component.html',
  styleUrls: ['./congresses.component.scss'],
})
export class CongressesComponent implements OnInit {
  congressEnabled: boolean = true;
  persons: any = [];
  congress: any;
  dataUser: any;
  congressSelected: any;
  see_logo: string = '';

  constructor(
    private congressService: CongressService,
    private router: Router
  ) {
    this.dataUser = JSON.parse(sessionStorage.getItem('_user-data')!);
    this.congressSelected = sessionStorage.getItem('activeCongress');
  }

  ngOnInit() {
    if (this.dataUser.rol == 'Organizador') {
      this.getCongressOrganizer();
    } else {
      this.getCongress();
    }
  }

  getCongressOrganizer() {
    return this.congressService.getCongress().subscribe(
      (res: any) => {
        if (res.data.length == 0) {
          this.congress = null;
        } else {
          res.data.forEach((element: any) => {
            if (
              element.person_id == this.dataUser._id &&
              element._id == this.congressSelected &&
              element.status_congress == 'Habilitado'
            ) {
              this.congress = element;
              this.congressEnabled = element.status_congress;
              this.see_logo = `http://localhost:3500/api/file/${element.logo}`;
            }
          });
        }
      },
      (err) => console.error(err)
    );
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
              this.see_logo = `http://localhost:3500/api/file/${element.logo}`;
            }
          });
        }
      },
      (err) => console.error(err)
    );
  }

  disableCongress(id: string) {
    Swal.fire({
      title: '??Est?? seguro de finalizar el congreso?',
      text: '??No podr??s volver a editarlo!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'S??',
    }).then((result) => {
      if (result.isConfirmed) {
        let data = {
          congress: {
            status_congress: 'Inhabilitado',
          },
        };

        this.congressService.putCongress(id, data).subscribe(() => {
          Swal.fire({
            position: 'center',
            icon: 'info',
            title: 'Congreso finalizado correctamente.',
            showConfirmButton: false,
            timer: 2000,
          }).then(() => this.router.navigate(['/']));
        });
      }
    });
  }
}
