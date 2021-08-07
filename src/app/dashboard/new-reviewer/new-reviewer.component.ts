import { Component, OnInit } from '@angular/core';
import { PersonService } from '../../services/person.service';
import { Person } from '../../models/person';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-reviewer',
  templateUrl: './new-reviewer.component.html',
  styleUrls: ['./new-reviewer.component.scss'],
})
export class NewReviewerComponent implements OnInit {
  viewPassword = true;
  dataUser: any;
  congressSelected: any;
  congress: any;

  person: Person = {
    rol: 'Revisor',
    type_dni: '',
    dni: '',
    names: '',
    last_names: '',
    level_academy: '',
    // specialty: "",
    title: '',
    phone: '',
    email: '',
    password: '',
    status: true,
    congress_id: '',
  };

  constructor(private personService: PersonService, private router: Router) {
    this.dataUser = JSON.parse(sessionStorage.getItem('_user-data')!);
    this.congressSelected = sessionStorage.getItem('activeCongress');
  }

  ngOnInit() {}

  postPerson() {
    if (
      this.person.type_dni &&
      this.person.dni &&
      this.person.names &&
      this.person.last_names &&
      this.person.level_academy &&
      // this.person.specialty &&
      this.person.title &&
      this.person.phone &&
      this.person.email
    ) {
      this.person.congress_id = this.congressSelected;
      this.person.password = this.person.dni;

      let dataPerson = {
        person: this.person,
      };

      let path =
        /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

      let validate = path.test(dataPerson.person.email!);

      let validateCI = this.validationDniCI(this.person.dni);

      if (validate) {
        if (validateCI) {
          this.personService.postPerson(dataPerson).subscribe(
            () => {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Creado exitosamente.',
                showConfirmButton: false,
                timer: 1500,
              }).then(() => this.router.navigate(['/dashboard/congresses']));
            },
            (err) => {
              if (err.error.info.keyPattern.dni == 1) {
                Swal.fire({
                  position: 'center',
                  icon: 'warning',
                  title: 'Cédula duplicada.',
                  showConfirmButton: false,
                  timer: 1500,
                });
              }
            }
          );
        } else {
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Por favor, ingrese una cédula válida',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } else {
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'Ingrese un correo válido.',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } else {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Completa todos los campos para continuar.',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }

  validationDniCI(ci: any) {
    if (ci.length === 10) {
      const digitRegion = ci.substring(0, 2);
      if (digitRegion >= String(0) && digitRegion <= String(24)) {
        const latestDigit = Number(ci.substring(9, 10));
        const pairs =
          Number(ci.substring(1, 2)) +
          Number(ci.substring(3, 4)) +
          Number(ci.substring(5, 6)) +
          Number(ci.substring(7, 8));

        let numberOne: any = ci.substring(0, 1);
        numberOne = numberOne * 2;
        if (numberOne > 9) {
          numberOne = numberOne - 9;
        }

        let numberThree: any = ci.substring(2, 3);
        numberThree = numberThree * 2;
        if (numberThree > 9) {
          numberThree = numberThree - 9;
        }

        let numberFive: any = ci.substring(4, 5);
        numberFive = numberFive * 2;
        if (numberFive > 9) {
          numberFive = numberFive - 9;
        }

        let numberSeven: any = ci.substring(6, 7);
        numberSeven = numberSeven * 2;
        if (numberSeven > 9) {
          numberSeven = numberSeven - 9;
        }

        let numberNine: any = ci.substring(8, 9);
        numberNine = numberNine * 2;
        if (numberNine > 9) {
          numberNine = numberNine - 9;
        }

        const odds =
          numberOne + numberThree + numberFive + numberSeven + numberNine;
        const sumTotal = pairs + odds;
        const firstDigitSum = String(sumTotal).substring(0, 1);
        const ten = (Number(firstDigitSum) + 1) * 10;
        let digitValidator = ten - sumTotal;
        if (digitValidator === 10) {
          digitValidator = 0;
        }
        if (digitValidator === latestDigit) {
          // console.log('Cédula válida');
          return true;
        } else {
          return false;
        }
      } else {
        // console.log('Cédula no válida');
        return false;
      }
    } else {
      // console.log('Cédula con más de 10 dígitos');
      return false;
    }
  }
}
