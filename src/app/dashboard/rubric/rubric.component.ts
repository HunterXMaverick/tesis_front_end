import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RubricService } from 'src/app/services/rubric.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rubric',
  templateUrl: './rubric.component.html',
  styleUrls: ['./rubric.component.scss'],
})
export class RubricComponent {
  qualificationCriterias: Array<string> = [];
  inputCriteria: string = '';
  rubric: any = null;
  rubricsHistory: Array<any> = [];
  congressSelected: any;
  showModal: boolean = false;
  dataUser: any;

  constructor(private rubricService: RubricService, private router: Router) {
    this.dataUser = JSON.parse(sessionStorage.getItem('_user-data')!);
    this.congressSelected = sessionStorage.getItem('activeCongress');
    this.getRubrics();
  }

  addQualificationCriteria() {
    const limitCriteria: number = 5;

    if (this.inputCriteria !== '') {
      if (this.qualificationCriterias.length + 1 <= limitCriteria) {
        this.qualificationCriterias.push(this.inputCriteria);
        this.inputCriteria = '';
      } else {
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'Máximo 5 criterios por congreso.',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } else {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Agregue un criterio para continuar.',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }

  deleteQualificationCriteria(index: number) {
    this.qualificationCriterias.splice(index, 1);
  }

  updateQualificationCriteria(index: number) {
    this.inputCriteria = this.qualificationCriterias[index];

    this.deleteQualificationCriteria(index);
  }

  getRubrics() {
    this.rubricService.getRubrics().subscribe((res: any) => {
      if (res.data.length == 0) {
        this.rubric = null;
      } else {
        res.data.forEach((element: any) => {
          if (
            element.congress_id == this.congressSelected &&
            element.state == true
          ) {
            this.rubric = element;
          }

          if (
            element.congress_id == this.congressSelected &&
            element.state == false
          ) {
            this.rubricsHistory.push(element);
          }
        });

        if (this.rubric == null) {
          Swal.fire({
            position: 'center',
            icon: 'info',
            title: 'Recuerda que tienes un máximo de 5 criterios por rúbrica.',
            showConfirmButton: true,
          });
        }
      }
    });
  }

  saveRubric() {
    let rubricData = {
      rubric: {
        qualificationCriteria: this.qualificationCriterias,
        state: true,
        congress_id: this.congressSelected,
      },
    };

    this.rubricService.postRubric(rubricData).subscribe(() => {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Creada exitosamente',
        showConfirmButton: false,
        timer: 1500,
      }).then(() => this.router.navigate(['/dashboard/congresses']));
    });
  }

  deleteRubric() {
    let dataRubric = {
      rubric: {
        state: false,
      },
    };
    this.rubricService.putRubric(this.rubric._id, dataRubric).subscribe(() => {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Inhabilitado exitosamente.',
        showConfirmButton: false,
        timer: 1500,
      }).then(() => this.router.navigate(['/dashboard/congresses']));
    });
  }

  handleModal(showModal: boolean) {
    this.showModal = showModal;
  }
}
