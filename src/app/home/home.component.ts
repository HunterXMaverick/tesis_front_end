import { Component, OnInit } from '@angular/core';
import { CongressService } from '../services/congress.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  congress_habilitado: any;
  congress_pendientes: any= [];
  congress: any;
  see_logo: string = '';

  constructor(
    private congressService: CongressService,
  ){
  }
  ngOnInit() {
    this.handleModal(false);
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
              element.status_congress == 'Habilitado'
            ) {
              this.congress_habilitado = element;
              this.see_logo = `http://localhost:3500/api/file/${element.logo}`;
            }
            if(
              element.status_congress == 'Pendiente'
            ){
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
}
