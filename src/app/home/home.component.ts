import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CongressService } from '../services/congress.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  congress_habilitado: any;
  congress_pendientes: any = [];
  congress: any;
  showSidebar: boolean = false;
  see_logo: string = '';

  constructor(
    private congressService: CongressService,
    private router: Router
  ) {
    sessionStorage.clear();
    this.getCongress();
  }

  ngOnInit() {
    this.handleModal(false);
    this.handleSidebar(false);
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
        }
      },
      (err) => console.error(err)
    );
  }

  handleModal(showModal: boolean) {
    let modal: any = document.getElementById('modal');

    if (showModal) {
      modal.classList.remove('hidden');
    } else {
      modal.classList.add('hidden');
    }
  }

  handleSidebar(showSidebar: boolean) {
    let sidebar: any = document.getElementById('menu');

    if (showSidebar) {
      sidebar.classList.remove('hidden');
    } else {
      sidebar.classList.add('hidden');
    }
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
}
