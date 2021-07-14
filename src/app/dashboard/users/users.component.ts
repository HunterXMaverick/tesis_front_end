import { Component, OnInit } from '@angular/core';
import { PersonService } from '../../services/person.service';
import Swal from 'sweetalert2';
import { CongressService } from 'src/app/services/congress.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  congressEnabled: boolean = true;
  congressCreated: boolean = false;
  photo: any = '';
  users: any = [];
  status: boolean = false;
  page: number = 1;

  dataUserLog: any = [];

  constructor(
    private personService: PersonService,

    private congressService: CongressService
  ) {
    this.getCongress();
  }

  ngOnInit() {
    this.getUsers();
    this.getPersonByEmail();
  }

  getCongress() {
    return this.congressService.getCongress().subscribe(
      async (res: any) => {
        if ((await res.data.length) == 0) {
          this.congressCreated = false;
        } else if ((await res.data.length) >= 1) {
          this.congressCreated = true;
          this.congressEnabled = res.data[0].status_congress;
        }
      },
      (err) => console.error(err)
    );
  }

  getUsers() {
    return this.personService.getUsers().subscribe(
      (res: any) => {
        this.users = res.data;
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
          position: 'top-end',
          icon: 'success',
          title: 'Usuario habilitado',
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Usuario inhabilitado',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  }

  getPersonByEmail() {
    return this.personService
      .getUserByEmail(this.personService.email)
      .then((res) => {
        this.dataUserLog = res.data;
      });
  }
}
