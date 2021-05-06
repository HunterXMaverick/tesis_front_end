import {Component, OnInit} from '@angular/core';
import {PersonService} from '../services/person.service';
import {Person} from '../models/person';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-reviewer',
  templateUrl: './register-reviewer.component.html',
  styleUrls: ['./register-reviewer.component.scss']
})
export class RegisterReviewerComponent implements OnInit {

  viewPassword = true;
  person: Person = {
    rol: 'Revisor',
    type_dni: '',
    dni: '',
    names: '',
    last_names: '',
    level_academy: '',
    specialty: '',
    phone: '',
    email: '',
    password: '',
    status: true,
  }

  constructor(
    private personService: PersonService,
    private router: Router
  ) {
  }

  ngOnInit() {
  }

  postPerson() {
    if (this.person.type_dni && this.person.dni && this.person.names && this.person.last_names && this.person.level_academy && this.person.specialty && this.person.phone && this.person.email && this.person.password) {
      let dataPerson = {
        person: this.person
      }
      let path = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
      let validate = path.test(dataPerson.person.email)
      if (validate) {
        this.personService.postPerson(dataPerson)
          .subscribe(
            res => {
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Registro exitoso',
                showConfirmButton: false,
                timer: 1500
              });
              this.router.navigate(['/login']);
            },
            err => {
              console.error(err);
            }
          );
      } else {
        Swal.fire({
          position: 'top-end',
          icon: 'warning',
          title: 'Correo inválido',
          showConfirmButton: false,
          timer: 1500
        });
      }
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
