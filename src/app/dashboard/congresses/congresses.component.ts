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

  constructor(
    private congressService: CongressService,
    private router: Router
  ) {
    this.dataUser = JSON.parse(sessionStorage.getItem('_user-data')!);
  }

  ngOnInit() {
    this.getCongress();
  }

  getCongress() {
    return this.congressService.getCongress().subscribe(
      (res: any) => {
        if (res.data.length == 0) {
          this.congress = null;
        } else if (res.data.length >= 1) {
          this.congress = res.data[0];
          this.congressEnabled = this.congress.status_congress;
        }
      },
      (err) => console.error(err)
    );
  }

  disableCongress(id: string) {
    Swal.fire({
      title: '¿Está seguro de finalizar el congreso?',
      text: '¡No podrás volver a editarlo!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
    }).then((result) => {
      if (result.isConfirmed) {
        let data = {
          congress: {
            status_congress: false,
          },
        };

        this.congressService
          .putCongress(id, data)
          .subscribe((response: any) => {
            console.log(response);
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Congreso deshabilitado correctamente.',
              showConfirmButton: false,
              timer: 3000,
            });
          });
        this.router.navigate(['/']);
      }
    });
  }
}
