import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PersonService} from '../../../services/person.service';
import {Person} from '../../../models/person';
import Swal from "sweetalert2";

@Component({
  selector: 'app-put-user',
  templateUrl: './put-user.component.html',
  styleUrls: ['./put-user.component.scss']
})
export class PutUserComponent implements OnInit {

  idUser: string
  dataUser: any = []
  person: Person = {
    names: '',
    last_names: '',
    phone: '',
  }
  logUser: any = []

  constructor(
    private router: ActivatedRoute,
    private personService: PersonService,
    private routerLink: Router
  ) {
  }

  ngOnInit() {
    this.getUserByEmail()
    this.idUser = this.router.snapshot.params.id
    this.getUserById()
  }

  getUserById() {
    return this.personService.getUserById(this.idUser).subscribe(
      res => {
        this.dataUser = res
        this.person.names = this.dataUser.person.names
        this.person.last_names = this.dataUser.person.last_names
        this.person.phone = this.dataUser.person.phone
      }
    )
  }

  getUserByEmail() {
    return this.personService.getUserByEmail(this.personService.email).subscribe(
      res => {
        this.logUser = res
      }
    )
  }

  putUser() {
    if (this.logUser.person.rol == 'Asistente') {
      this.person.phone = '0999999999'
    }
    if (this.person.names && this.person.last_names && this.person.phone) {
      let dataPerson = {
        person: this.person
      }
      let pathOnlyLetters = /^[ñA-ZñÑáéíóúÁÉÍÓÚa-z _]*$/
      let pathPhone = /^0[0-9]{1}[0-9]{8}$/
      let validateNames = pathOnlyLetters.test(dataPerson.person.names)
      let validateLastNames = pathOnlyLetters.test(dataPerson.person.last_names)
      let validatePhone = pathPhone.test(dataPerson.person.phone)
      if (validateNames && validateLastNames) {
        if (validatePhone) {
          Swal.fire({
            title: '¿Está seguro de actualizar los datos ingresados?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar'
          }).then((result) => {
            if (result.isConfirmed) {
              this.personService.putPerson(this.idUser, dataPerson)
                .subscribe(
                  res => {
                    this.routerLink.navigate(['/dashboard/congresses']);
                  },
                  err => {
                    console.error(err);
                  }
                );
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Actualización exitosa',
                showConfirmButton: false,
                timer: 1500
              });
            }
          })
        } else {
          Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: 'Por favor, ingrese un teléfono válido',
            showConfirmButton: false,
            timer: 1500
          });
        }
      } else {
        Swal.fire({
          position: 'top-end',
          icon: 'warning',
          title: 'Por favor, ingresar solo letras en nombres y apellidos',
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
