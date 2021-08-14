import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CongressService } from '../services/congress.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  congress_habilitado: any;
  congress_pendientes: any = [];
  congress: any;
  showSidebar: boolean = false;
  showModal: boolean = false;
  see_logo: string = '';
  loading: boolean = true;

  constructor(
    private congressService: CongressService,
    private router: Router
  ) {
    sessionStorage.clear();
    this.getCongress();
  }

  getCongress() {
    return this.congressService.getCongress().subscribe(
      (res: any) => {
        if (res.data.length == 0) {
          this.congress = null;
        } else {
          res.data.forEach((element: any) => {
            if (element.status_congress == 'Habilitado') {
              this.congress_habilitado = element;
              this.see_logo = `http://localhost:3500/api/file/${element.logo}`;
            }
            if (element.status_congress == 'Pendiente') {
              this.congress_pendientes.push(element);
            }
          });
          this.loading = false;
        }
      },
      (err) => console.error(err)
    );
  }

  handleModal(showModal: boolean) {
    this.showModal = showModal;
  }

  handleSidebar(showSidebar: boolean) {
    this.showSidebar = showSidebar;
  }

  logIn() {
    let id_congress = this.congress_habilitado._id;
    sessionStorage.setItem('activeCongress', id_congress);
    this.router.navigate(['login']);
  }

  signUpAssitant() {
    let id_congress = this.congress_habilitado._id;
    sessionStorage.setItem('activeCongress', id_congress);
    this.router.navigate(['register-assistant']);
  }

  signUpSpeaker() {
    let id_congress = this.congress_habilitado._id;
    sessionStorage.setItem('activeCongress', id_congress);
    this.router.navigate(['register-speaker']);
  }

  newCongress() {
    sessionStorage.setItem('activeCongress', '0000');
    this.router.navigate(['login']);
  }
}
