import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PermissionsService } from '../services/permissions.service';
import { PersonService } from '../services/person.service';
import Swal from 'sweetalert2';
import { CongressService } from '../services/congress.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  viewPassword = true;
  loginData: FormGroup;
  congresses: Array<any> = [];

  constructor(
    private personServices: PersonService,
    private permissions: PermissionsService,
    private formBuilder: FormBuilder,
    private congressService: CongressService,
    private router: Router
  ) {
    this.loginData = this.formBuilder.group({
      email: ['organizador@gmail.com', Validators.required],
      password: ['1234', Validators.required],
      rol: ['Organizador', Validators.required],
    });
  }

  ngOnInit() {
    this.handleModal(false);
    this.handleModalCongress(false);
  }

  getCongress(id_login: string, rol: string) {
    this.congresses = [];

    switch (rol) {
      case 'Organizador':
        this.congressService.getCongress().subscribe(
          (res: any) => {
            if (res.data.length == 0) {
              // this.congresses = [];
              this.handleModalCongress(false);
              Swal.fire({
                icon: 'success',
                title: 'Inicio de Sesión Exitosa',
                showConfirmButton: false,
                timer: 1500,
              }).then(() => this.router.navigate(['dashboard/congresses']));
            } else {
              res.data.forEach((element: any) => {
                if (
                  element.person_id == id_login &&
                  element.status_congress == 'Habilitado'
                ) {
                  this.congresses.push(element);
                }
              });

              if (this.congresses.length == 0) {
                this.handleModalCongress(false);
                Swal.fire({
                  icon: 'success',
                  title: 'Inicio de Sesión Exitosa',
                  showConfirmButton: false,
                  timer: 1500,
                }).then(() => this.router.navigate(['dashboard/congresses']));
              }
            }
          },
          (err) => console.error(err)
        );
        break;

      default:
        this.congressService.getCongress().subscribe(
          (res: any) => {
            if (res.data.length == 0) {
              this.congresses = [];
            } else {
              res.data.forEach((elementCongress: any) => {
                if (elementCongress.status_congress == 'Habilitado') {
                  this.personServices.getUsers().subscribe((response: any) => {
                    response.data.forEach((element: any) => {
                      if (
                        element.congress_id == elementCongress._id &&
                        element._id == id_login
                      ) {
                        this.congresses.push(elementCongress);
                      }
                    });
                  });
                }
              });
            }
          },
          (err) => console.error(err)
        );
        break;
    }
  }

  login(id_congress: string) {
    sessionStorage.setItem('activeCongress', id_congress);
    this.handleModalCongress(false);
    Swal.fire({
      icon: 'success',
      title: 'Inicio de Sesión Exitosa',
      showConfirmButton: false,
      timer: 1500,
    }).then(() => this.router.navigate(['dashboard/congresses']));
  }

  validateLogin() {
    let email = this.loginData.get('email')!.value,
      password = this.loginData.get('password')!.value,
      rol = this.loginData.get('rol')!.value,
      path =
        /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
      validate = path.test(email);

    if (email != '' && password != '' && rol != '') {
      if (validate) {
        let dataLogin = {
          person: {
            email,
            password,
            rol,
          },
        };

        this.personServices.login(dataLogin).subscribe(
          (data: any) => {
            if (data.ok == true) {
              if (this.permissions.decodeToken(data.token)) {
                this.handleModalCongress(true);
                let dataUser = JSON.parse(
                  sessionStorage.getItem('_user-data')!
                );
                this.getCongress(dataUser._id, dataUser.rol);
              } else {
                email = '';
                password = '';
                rol = '';

                Swal.fire({
                  icon: 'error',
                  title: 'Ups! Algo salio mal, intentalo más tarde.',
                  showConfirmButton: false,
                  timer: 1500,
                });
              }
            }
          },
          (error) => {
            if (!error.error.ok) {
              let errorInfo = error.error.info;

              switch (errorInfo) {
                case 'Usuario no encontrado':
                  Swal.fire({
                    icon: 'warning',
                    title:
                      'Correo electrónico o rol incorrectos, vuelve a intentarlo.',
                    showConfirmButton: false,
                    timer: 2000,
                  });
                  break;

                case 'Usuario deshabilitado':
                  Swal.fire({
                    icon: 'warning',
                    title: 'Usuario desabilitado.',
                    showConfirmButton: false,
                    timer: 1500,
                  });
                  break;

                case 'Contraseña incorrecta':
                  Swal.fire({
                    icon: 'warning',
                    title: 'Contraseña incorrecta, vuelve a intentarlo.',
                    showConfirmButton: false,
                    timer: 2000,
                  });
                  break;
                default:
                  break;
              }
            }
          }
        );
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Ingrese un correo electrónico válido para continuar.',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Completa todos los campos para continuar.',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }

  handleModal(showModal: boolean) {
    let modal: any = document.getElementById('modal');

    if (showModal) {
      modal.classList.remove('hidden');
    } else {
      modal.classList.add('hidden');
    }
  }

  handleModalCongress(showModal: boolean) {
    let modal: any = document.getElementById('modal-congress');

    if (showModal) {
      modal.classList.remove('hidden');
    } else {
      modal.classList.add('hidden');
    }
  }
}
