import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonService } from '../../../services/person.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilesService } from 'src/app/services/files.service';

@Component({
  selector: 'app-put-user',
  templateUrl: './put-user.component.html',
  styleUrls: ['./put-user.component.scss'],
})
export class PutUserComponent {
  user: FormGroup;
  idUser: string;
  dataUser: any = [];
  logUser: any = [];
  profile_picture_url: string = '';

  constructor(
    private router: ActivatedRoute,
    private personService: PersonService,
    private routerLink: Router,
    private filesService: FilesService,
    public fb: FormBuilder
  ) {
    this.user = this.fb.group({
      names: ['', [Validators.required]],
      last_names: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      profile_picture: [null],
    });
    this.idUser = this.router.snapshot.params.id;
    this.getUserById();
  }

  getUserById() {
    return this.personService.getUserById(this.idUser).subscribe((res: any) => {
      this.dataUser = res.data;
      this.logUser = res.data;

      if (this.dataUser.profile_picture) {
        this.profile_picture_url = `http://localhost:3500/api/file/${this.dataUser.profile_picture}`;
        console.log(this.profile_picture_url);

        this.user.setValue({
          names: this.dataUser.names,
          last_names: this.dataUser.last_names,
          phone: this.dataUser.phone,
          profile_picture: this.dataUser.profile_picture,
        });
      } else {
        this.user.setValue({
          names: this.dataUser.names,
          last_names: this.dataUser.last_names,
          phone: this.dataUser.phone,
          profile_picture: null,
        });
      }
    });
  }

  // getUserByEmail() {
  //   return this.personService
  //     .getUserByEmail(this.personService.email)
  //     .subscribe((res: any) => {
  //       this.logUser = res.data;
  //     });
  // }

  putUser() {
    if (this.logUser.rol == 'Participante') {
      this.user.setValue({
        phone: '0999999999',
      });
    }
    if (this.user.valid) {
      let pathOnlyLetters = /^[ñA-ZñÑáéíóúÁÉÍÓÚa-z _]*$/;
      let pathPhone = /^0[0-9]{1}[0-9]{8}$/;
      let validateNames = pathOnlyLetters.test(this.user.get('names')!.value);
      let validateLastNames = pathOnlyLetters.test(
        this.user.get('last_names')!.value
      );
      let validatePhone = pathPhone.test(this.user.get('phone')!.value);

      if (validateNames && validateLastNames) {
        if (validatePhone) {
          Swal.fire({
            title: '¿Está seguro de actualizar los datos ingresados?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
          }).then((result) => {
            if (result.isConfirmed) {
              if (this.profile_picture_url == '') {
                const formData: any = new FormData();
                formData.append(
                  'file',
                  this.user.get('profile_picture')!.value
                );

                this.filesService
                  .uploadFile('images', formData)
                  .then((response) => {
                    if (response.ok) {
                      this.user.patchValue({
                        profile_picture: `${response.data.directory}/${response.data.name}`,
                      });
                    } else {
                      this.filesService
                        .deleteFile(
                          `${response.data.directory}`,
                          `${response.data.name}`
                        )
                        .then((response: any) => {
                          console.log(response.info);
                        })
                        .catch((error) => {
                          console.error(error);
                        });
                    }
                  })
                  .then(() => {
                    let dataPerson = {
                      person: this.user.value,
                    };

                    this.personService
                      .putPerson(this.idUser, dataPerson)
                      .subscribe(
                        (res) => {
                          this.routerLink.navigate(['/dashboard/congresses']);
                        },
                        (err) => {
                          console.error(err);
                        }
                      );
                    Swal.fire({
                      position: 'top-end',
                      icon: 'success',
                      title: 'Actualización exitosa',
                      showConfirmButton: false,
                      timer: 1500,
                    });
                  });
              } else {
                let dataPerson = {
                  person: this.user.value,
                };

                this.personService.putPerson(this.idUser, dataPerson).subscribe(
                  (res) => {
                    this.routerLink.navigate(['/dashboard/congresses']);
                  },
                  (err) => {
                    console.error(err);
                  }
                );
                Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: 'Actualización exitosa',
                  showConfirmButton: false,
                  timer: 1500,
                });
              }
            }
          });
        } else {
          Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: 'Por favor, ingrese un teléfono válido',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } else {
        Swal.fire({
          position: 'top-end',
          icon: 'warning',
          title: 'Por favor, ingresar solo letras en nombres y apellidos',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } else {
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: 'Debes completar todos los datos',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }

  handleFileInput(event: any) {
    const file = (event.target as HTMLInputElement).files![0];

    this.user.patchValue({
      profile_picture: file,
    });
    this.user.get('profile_picture')!.updateValueAndValidity();
  }
}
