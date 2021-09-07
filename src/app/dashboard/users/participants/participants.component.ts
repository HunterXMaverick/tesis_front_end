import { Component, OnInit } from '@angular/core';
import { PersonService } from '../../../services/person.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss'],
})
export class ParticipantsComponent implements OnInit {
  congressSelected: any;
  photo: any = '';
  users: any = [];
  // status: boolean;
  page: number = 1;

  constructor(private personService: PersonService) {
    this.congressSelected = sessionStorage.getItem('activeCongress');
  }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    return this.personService.getUsers().subscribe(
      (res: any) => {
        if (res.data.length == 0) {
          this.users = [];
        } else {
          res.data.forEach((element: any) => {
            if (
              element.congress_id == this.congressSelected &&
              element.rol == 'Participante'
            ) {
              this.users.push(element);
            }
          });
        }
      },
      (err) => console.error(err)
    );
  }

  disableEnableUser(id: string, status: boolean) {
    let dataPerson = {
      status: status,
    };
    this.personService.disableEnablePerson(id, dataPerson).subscribe((res) => {
      if (status == true) {
        Swal.fire({
          icon: 'success',
          title: 'Usuario habilitado',
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Usuario inhabilitado',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  }
}
