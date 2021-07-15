import { Component, OnInit } from '@angular/core';
import { PersonService } from '../../../services/person.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reviewer',
  templateUrl: './reviewer.component.html',
  styleUrls: ['./reviewer.component.scss'],
})
export class ReviewerComponent implements OnInit {
  photo: any = '';
  users: any = [];
  // status: boolean;
  page: number = 1;

  constructor(private personService: PersonService) {}

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    return this.personService.getUsers().subscribe(
      (res: any) => {
        res.data.forEach((element: any) => {
          if (element.rol == 'Revisor') {
            this.users.push(element);
          }
        });
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
