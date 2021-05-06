import {Component, OnInit} from '@angular/core';
import {LinksService} from '../../services/links.service';
import {PersonService} from '../../services/person.service';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss']
})
export class LinksComponent implements OnInit {

  links: any = []
  dataUser: any = []

  constructor(
    private linksService: LinksService,
    private personService: PersonService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.getLinks();
    this.getUserByEmail();
  }

  getLinks() {
    return this.linksService.getLinks().subscribe(
      res => {
        this.links = res;
      },
      err => console.error(err)
    )
  }

  getUserByEmail() {
    return this.personService.getUserByEmail(this.personService.email).subscribe(
      res => {
        this.dataUser = res
      },
      err => console.error(err)
    )
  }

  deleteLink(id) {
    Swal.fire({
      title: '¿Está seguro de eliminar el enlace registrado?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.linksService.deleteLink(id)
          .subscribe(
            res => {
              this.getLinks()
            },
            err => {
              console.error(err);
            }
          );
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Enlace eliminado exitosamente',
          showConfirmButton: false,
          timer: 1500
        });
      }
    })
  }
}
