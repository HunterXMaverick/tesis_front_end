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
    let rubricData = {
      rubric: this.rubric.getRawValue(),
    };

    console.log(this.rubric.getRawValue());

    this.rubricService
      .postRubric(rubricData)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.error(error));
  }
}
