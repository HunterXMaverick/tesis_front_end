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
  }

  ngOnInit(): void {
    this.getRubrics();
  }

  getRubrics() {
    return this.rubricsService.getRubrics().subscribe(
      (res: any) => {
        this.rubrics = res.data;
        this.rubrics.forEach((element: any) => {
          this.parameters = element.qualificationCriteria;
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
          title: 'Máximo 5 observaciones.',
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
        },
      };

      this.qualificationService
        .postQualification(qualificationData)
        .subscribe((response) => {
          Swal.fire({
            position: 'top-end',
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
        position: 'top-end',
        icon: 'warning',
        title: 'Califique todos los criterios para continuar.',
        showConfirmButton: false,
        timer: 1800,
      });
    }
  }

  putStateQualification() {
    let percentage: number =
        (this.sumreviewersRatings * 100) /
        Number(this.parameters.length + '00'),
      postulationData;

    if (percentage >= 70 || percentage <= 100) {
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
      .subscribe((res) => {
        console.log(JSON.stringify(sessionStorage.getItem('postulationdata')));
      });
  }
}
