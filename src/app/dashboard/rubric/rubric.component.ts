import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CongressService } from 'src/app/services/congress.service';
import { RubricService } from 'src/app/services/rubric.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rubric',
  templateUrl: './rubric.component.html',
  styleUrls: ['./rubric.component.scss'],
})
export class RubricComponent {
  congressEnabled: boolean = true;
  congressCreated: boolean = false;
  qualificationCriterias: Array<string> = [];
  inputCriteria: string = '';
  rubric: any;

  constructor(
    private rubricService: RubricService,
    private router: Router,
    private congressService: CongressService
  ) {
    this.getRubrics();
    this.getCongress();
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
      } else if (res.data.length >= 1) {
        this.rubric = res.data[0];
      }
      console.log(res);
    });
  }

  saveRubric() {
    let rubricData = {
      rubric: {
        qualificationCriteria: this.qualificationCriterias,
        ratingRange: '0-100',
        reviewersRating: '',
      },
    };

    this.rubricService.postRubric(rubricData).subscribe((response) => {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Creación exitosa',
        showConfirmButton: false,
        timer: 1500,
      });
      this.router.navigate(['/dashboard/congresses']);
    });
  }

  deleteRubric() {
    this.rubricService
      .deleteRubric(this.rubric._id)
      .subscribe((response: any) => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Eliminado exitosamente',
          showConfirmButton: false,
          timer: 1500,
        });
        this.router.navigate(['/dashboard/congresses']);
      });
  }
}
