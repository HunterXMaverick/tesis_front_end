import { Component, OnInit } from '@angular/core';
import { RubricService } from '../../services/rubric.service';
import { PostulationService } from '../../services/postulation.service';
import { QualificationService } from '../../services/qualification';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss'],
})
export class EvaluationComponent implements OnInit {
  rubrics: any = [];
  parameters: any = [];

  congressSelected: any;
  inputreviewersRating: number = 0;
  inputremark: string = '';
  postulations_id: string = '';
  reviewersRatings: Array<number> = [];
  scoreRemarks: Array<any> = [];
  sumreviewersRatings: number = 0;
  remarks: Array<string> = [];
  qualificaty: number = 0;
  //person_id: string = "";

  constructor(
    private rubricsService: RubricService,
    private qualificationService: QualificationService,
    private postulationService: PostulationService,
    private router: Router
  ) {
    this.postulations_id = sessionStorage.getItem('postulationdata')!;
    this.congressSelected = sessionStorage.getItem('activeCongress');
    this.getRubrics();
  }

  ngOnInit(): void {
    this.handleModal(true);
  }

  handleModal(showModal: boolean) {
    let modal: any = document.getElementById('modal');

    if (showModal) {
      modal.classList.remove('hidden');
    } else {
      modal.classList.add('hidden');
    }
  }

  getRubrics() {
    return this.rubricsService.getRubrics().subscribe(
      (res: any) => {
        this.rubrics = res.data;
        this.rubrics.forEach((element: any) => {
          if (element.congress_id == this.congressSelected) {
            this.parameters = element.qualificationCriteria;
          }
        });
      },
      (err) => {
        console.error(err);
      }
    );
  }

  addQuality() {
    if (
      this.inputreviewersRating !== null &&
      this.inputreviewersRating >= 0 &&
      this.inputreviewersRating <= 100
    ) {
      if (this.reviewersRatings.length + 1 <= this.parameters.length) {
        if (this.remarks.length + 1 <= this.parameters.length) {
          this.reviewersRatings.push(this.inputreviewersRating);
          this.sumreviewersRatings +=
            this.inputreviewersRating / this.parameters.length;
          this.inputreviewersRating = 0;
          this.remarks.push(this.inputremark);
          this.scoreRemarks = [
            this.parameters,
            this.remarks,
            this.reviewersRatings,
          ];

          this.inputremark = '';
        } else {
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: `Máximo ${this.parameters.length} notas.`,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } else {
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: `Máximo ${this.parameters.length} observaciones.`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } else {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Agregue un nota para continuar.',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }

  postQualification() {
    if (this.reviewersRatings.length == this.parameters.length) {
      let qualificationData = {
        qualification: {
          postulation_id: this.postulations_id,
          reviewersRating: this.reviewersRatings,
          remark: this.remarks,
          qualificaty: this.sumreviewersRatings,
          person_id: JSON.parse(sessionStorage.getItem('_user-data')!)._id,
          congress_id: this.congressSelected,
        },
      };

      this.qualificationService
        .postQualification(qualificationData)
        .subscribe(() => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Calificado exitosamente.',
            showConfirmButton: false,
            timer: 1800,
          }).then;
          this.putStateQualification();
          this.router.navigate(['/dashboard/postulations']);
        });
    } else {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Califique todos los criterios para continuar.',
        showConfirmButton: false,
        timer: 1800,
      });
    }
  }

  putStateQualification() {
    let postulationData,
      rate = Math.trunc(this.sumreviewersRatings);

    if (rate <= 100 && rate >= 70) {
      postulationData = {
        postulation: { status_quelification: true, status: 'Aprobado' },
      };
    } else {
      postulationData = {
        postulation: { status_quelification: true, status: 'Reprobado' },
      };
    }

    this.postulationService
      .putPostulation(this.postulations_id, postulationData)
      .subscribe(() => {
        console.log(JSON.stringify(sessionStorage.getItem('postulationdata')));
      });
  }
}
