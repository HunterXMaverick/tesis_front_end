import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {LinksService} from '../../../services/links.service';
import {Link} from '../../../models/link';
import {Router} from '@angular/router';
import Swal from "sweetalert2";

@Component({
  selector: 'app-put-link',
  templateUrl: './put-link.component.html',
  styleUrls: ['./put-link.component.scss']
})
export class PutLinkComponent implements OnInit {

  idLink: string
  dataLink: any = []
  today = new Date().toISOString().split("T")[0];
  link: Link = {
    name: '',
    link_video: '',
    date_event: ''
  }

  constructor(
    private router: ActivatedRoute,
    private linksService: LinksService,
    private routerLink: Router
  ) {
  }

  ngOnInit() {
    this.idLink = this.router.snapshot.params.idLink
    this.getLinkById()
  }

  getLinkById() {
    return this.linksService.getLinkById(this.idLink).subscribe(
      res => {
        this.dataLink = res
        this.link.name = this.dataLink.link.name
        this.link.link_video = this.dataLink.link.link_video
        this.link.date_event = this.dataLink.link.date_event
        let separatorDE = this.link.date_event.split('T')
        this.link.date_event = separatorDE[0]
      },
      err => console.error(err)
    )
  }

  putLink() {
    if (this.link.name && this.link.link_video && this.link.date_event) {
      this.link.date_event = this.link.date_event + 'T10:00:00.000+00:00'
      let dataLink = {
        link: this.link
      }
      this.linksService.putLink(this.idLink, dataLink).subscribe(
        res => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Actualización Exitosa',
            showConfirmButton: false,
            timer: 1500
          });
          this.routerLink.navigate(['/dashboard/links']);
        }
      )
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
