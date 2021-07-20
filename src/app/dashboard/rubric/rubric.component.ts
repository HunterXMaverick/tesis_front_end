import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CongressService } from 'src/app/services/congress.service';
import { RubricService } from 'src/app/services/rubric.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rubric',
  templateUrl: './rubric.component.html',
  styleUrls: ['./rubric.component.scss'],
})
export class RubricComponent implements OnInit {
  congress: any;
  congressEnabled: boolean = true;
  congressCreated: boolean = false;
  qualificationCriterias: Array<string> = [];
  inputCriteria: string = '';
  rubric: any;
  rubricsHistory: Array<any> = [];
  congressSelected: any;
  dataUser: any;

  constructor(
    private rubricService: RubricService,
    private router: Router,
    private congressService: CongressService
  ) {
    this.dataUser = JSON.parse(sessionStorage.getItem('_user-data')!);
    this.congressSelected = sessionStorage.getItem('activeCongress');
    this.getCongress();
  }

  ngOnInit() {
    this.handleModal(false);
    this.getRubrics();
  }

  getCongress() {
    return this.congressService.getCongress().subscribe(
      (res: any) => {
        if (res.data.length == 0) {
          this.congressCreated = false;
        } else {
          res.data.forEach((element: any) => {
            if (
              // element.person_id == this.dataUser._id &&
              element._id == this.congressSelected &&
              element.status_congress == 'Habilitado'
            ) {
              this.congress = element;
              this.congressCreated = true;
              this.congressEnabled = element.status_congress;
            }
          });
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
      } else {
        res.data.forEach((element: any) => {
          if (
            element.congress_id == this.congress._id &&
            element.state == true
          ) {
            this.rubric = element;
          }

          if (
            element.congress_id == this.congress._id &&
            element.state == false
          ) {
            this.rubricsHistory.push(element);
          }
        });
      }
    });
  }

  saveRubric() {
    let rubricData = {
      rubric: {
        qualificationCriteria: this.qualificationCriterias,
        state: true,
        congress_id: this.congress._id,
      },
    };

    this.rubricService.postRubric(rubricData).subscribe(() => {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Rúbrica creada exitosamente',
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
    let modal: any = document.getElementById('modal');

    if (showModal) {
      modal.classList.remove('hidden');
    } else {
      modal.classList.add('hidden');
    }
  }
}
