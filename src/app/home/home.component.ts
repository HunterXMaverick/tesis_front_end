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
  showSidebar: boolean = false;
  see_logo: string = '';

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
        console.log(res);

        if (res.data.length == 0) {
          this.congress_habilitado = false;
          // this.congress_pendientes = null;
        } else {
          res.data.forEach((element: any) => {
            console.log(element);

            if (element.status_congress == 'Habilitado') {
              this.congress_habilitado = element;
              this.see_logo = `http://localhost:3500/api/file/${element.logo}`;
            }
            if (element.status_congress == 'Pendiente') {
              this.congress_pendientes.push(element);
            }
          });
        }
        console.log(this.congress_habilitado);
      },
      (err) => console.error(err)
    );
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
