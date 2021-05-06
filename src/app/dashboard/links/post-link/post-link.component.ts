import {Component, OnInit} from '@angular/core';
import {LinksService} from '../../../services/links.service';
import {Link} from '../../../models/link';
import {Router} from '@angular/router';
import Swal from "sweetalert2";

@Component({
  selector: 'app-post-link',
  templateUrl: './post-link.component.html',
  styleUrls: ['./post-link.component.scss']
})
export class PostLinkComponent implements OnInit {

  today = new Date().toISOString().split("T")[0];

  link: Link = {
    name: '',
    link_video: '',
    date_event: ''
  }

  constructor(
    private linksService: LinksService,
    private router: Router
  ) {
  }

  ngOnInit() {
  }

  postLink() {
    if (this.link.name && this.link.link_video && this.link.date_event) {
      this.link.date_event = this.link.date_event + 'T10:00:00.000+00:00'
      let dataLink = {
        link: this.link
      }
      this.linksService.postLink(dataLink).subscribe(
        res => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Registro Exitoso',
            showConfirmButton: false,
            timer: 1500
          });
          this.router.navigate(['/dashboard/links']);
        }
      )
    } else {
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: 'Por favor, completar todos los datos',
        showConfirmButton: false,
        timer: 1500
      });
    }
  }
}
