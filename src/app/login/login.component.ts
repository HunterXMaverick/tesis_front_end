import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {PermissionsService} from '../services/permissions.service';
import {PersonService} from '../services/person.service';
import {Data} from '../models/data';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  viewPassword = true;
  loginData: FormGroup;

  constructor(
    private personServices: PersonService,
    private permissions: PermissionsService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.loginData = this.formBuilder.group({
      email: ["", Validators.required],
      password: ["", Validators.required],
    });
  }

  login(): void {
    let email = this.loginData.get('email').value;
    let password = this.loginData.get('password').value;
    let path = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
    let dataLogin = {
      person: {
        password,
        email
      }
    };
    let validate = path.test(dataLogin.person.email)
    if (dataLogin.person.email != '' && dataLogin.person.password != '') {
      if (validate) {
        this.personServices.login(dataLogin).subscribe((data: Data) => {
          if (data.ok == true) {
            if (this.permissions.decodeToken(data.token)) {
              Swal.fire({
                icon: 'success',
                title: 'Inicio de Sesión Exitosa',
                showConfirmButton: false,
                timer: 1500
              });
              this.router.navigate(['dashboard/congresses']);
            } else {
              email = '';
              password = '';
              console.log('Error')
            }
          } else if (data.ok == false) {
            Swal.fire({
              icon: 'warning',
              title: 'Correo y/o contraseña incorrectos',
              showConfirmButton: false,
              timer: 1500
            });
          }
        });
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Por favor, ingrese un correo válido',
          showConfirmButton: false,
          timer: 1500
        });
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Por favor, completar todos los datos',
        showConfirmButton: false,
        timer: 1500
      });
    }
  }
}
