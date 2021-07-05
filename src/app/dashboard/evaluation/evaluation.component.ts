import { Component, OnInit } from '@angular/core';
import { RubricService } from '../../services/rubric.service';
import { Rubrics } from "../../models/rubrics";
import { QualificationService } from "../../services/qualification";
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss']
})
export class EvaluationComponent implements OnInit {
  rubrics: any = [];
  parameters: any = [];

  inputreviewersRating: number = 0;
  inputremark: string = "";
  postulations_id: string = "";
  reviewersRatings: Array<number> = [];
  sumreviewersRatings: number=0;
  remarks: Array<string> = [];
  qualificaty: number = 0;
  person_id: string = "";

  constructor(
    private rubricsService: RubricService,
    private qualificationService: QualificationService,
    private router: Router,
  ) { }

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
      });
  }

  addQuality() {
    const limitCriteria: number = 5;
    if (this.inputreviewersRating !== null) {
      if (this.reviewersRatings.length + 1 <= limitCriteria) {
        if (this.remarks.length + 1 <= limitCriteria) {
          this.reviewersRatings.push(this.inputreviewersRating);
          this.sumreviewersRatings+=this.inputreviewersRating;
          this.inputreviewersRating = 0;
          this.remarks.push(this.inputremark);
          this.inputremark = "";
        } else {
          Swal.fire({
            position: "center",
            icon: "warning",
            title: "Máximo 5 notas.",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } else {
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "Máximo 5 observaciones.",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } else {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "Agregue un nota para continuar.",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }

  postQualification() {
    let qualificationData = {
      qualification: {
        postulations_id: sessionStorage.getItem('postulationdata'),
        reviewersRating: this.reviewersRatings,
        remark: this.remarks,
        qualificaty: this.sumreviewersRatings,
        person_id: JSON.stringify(sessionStorage.getItem('_user-data'))
      },
    };

    this.qualificationService.postQualification(qualificationData).subscribe((response) => {
      console.log(response);

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Creación exitosa",
        showConfirmButton: false,
        timer: 1500,
      });
      this.router.navigate(["/dashboard/postulations"]);
    });
  }
}
