import { Component } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { RubricService } from "src/app/services/rubric.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-rubric",
  templateUrl: "./rubric.component.html",
  styleUrls: ["./rubric.component.scss"],
})
export class RubricComponent {
  rubric: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private rubricService: RubricService,
    private router: Router
  ) {
    this.rubric = this.fb.group({
      qualificationCriteria: this.fb.array([]),
      ratingRange: ["", Validators.required],
      reviewersRating: ["", Validators.required],
    });
    this.addCriteria();
  }

  get qualificationCriteria(): FormArray {
    return this.rubric.get("qualificationCriteria") as FormArray;
  }

  addCriteria() {
    const qualificationCriteria = this.fb.group({
      qualificationCriteria: new FormControl(""),
    });

    this.qualificationCriteria.push(qualificationCriteria);
  }

  deleteCriteria(index: number) {
    this.qualificationCriteria.removeAt(index);
  }

  saveRubric() {
    let qualificationCriteriaTemp: Array<string> = [];

    for (let index = 0; index < this.qualificationCriteria.length; index++) {
      let element = this.qualificationCriteria.at(index).value;

      qualificationCriteriaTemp.push(element.qualificationCriteria);
    }

    let rubricData = {
      rubric: {
        qualificationCriteria: qualificationCriteriaTemp,
        ratingRange: this.rubric.get("ratingRange")!.value,
        reviewersRating: this.rubric.get("reviewersRating")!.value,
      },
    };

    this.rubricService.postRubric(rubricData).subscribe((response) => {
      console.log(response);

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Creación exitosa",
        showConfirmButton: false,
        timer: 1500,
      });
      this.router.navigate(["/dashboard/congresses"]);
    });
  }
}
