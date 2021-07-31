import { Component, OnInit } from '@angular/core';
import { PersonService } from '../../services/person.service';
import { CongressService } from 'src/app/services/congress.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  congressEnabled: boolean = true;
  congressCreated: boolean = false;
  congressSelected: any;
  photo: any = '';
  users: Array<any> = [];
  status: boolean = false;
  page: number = 1;

  constructor(
    private personService: PersonService,
    private congressService: CongressService
  ) {
    this.congressSelected = sessionStorage.getItem('activeCongress');
    this.getCongress();
  }

  ngOnInit() {
    this.getUsers();
  }

  getCongress() {
    return this.congressService.getCongress().subscribe(
      (res: any) => {
        if (res.data.length == 0) {
          this.congressCreated = false;
        } else {
          res.data.forEach((element: any) => {
            if (
              element._id == this.congressSelected &&
              element.status_congress == 'Habilitado'
            ) {
              this.congressCreated = true;
              this.congressEnabled = element.status_congress;
            }
          });
        }
      },
      (err) => console.error(err)
    );
  }

  getUsers() {
    return this.personService.getUsers().subscribe(
      (res: any) => {
        if (res.data.length == 0) {
          this.users = [];
        } else {
          res.data.forEach((element: any) => {
            if (element.congress_id == this.congressSelected) {
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
}
