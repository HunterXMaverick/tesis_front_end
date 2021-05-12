import { Component, OnInit } from "@angular/core";
import { CongressService } from "../../../services/congress.service";
import { Congress } from "../../../models/congress";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: "app-create-congress",
  templateUrl: "./create-congress.component.html",
  styleUrls: ["./create-congress.component.scss"],
})
export class CreateCongressComponent implements OnInit {
  congress: any = [];
  today = new Date().toISOString().split("T")[0];

  modelCongress: Congress = {
    name: "",
    address_web: "",
    start_date: "",
    end_date: "",
    regulations: "",
    capacity_speakers: 0,
    capacity_participants: 0,
    knowledge_area: [],
    status_congress: true,
  };

  constructor(
    private congressService: CongressService,
    private router: Router
  ) {}

  ngOnInit() {}

  postCongress() {
    if (
      this.modelCongress.name &&
      this.modelCongress.address_web &&
      this.modelCongress.start_date &&
      this.modelCongress.end_date &&
      this.modelCongress.regulations &&
      this.modelCongress.knowledge_area &&
      this.modelCongress.capacity_speakers > 0 &&
      this.modelCongress.capacity_participants > 0
    ) {
      this.modelCongress.start_date =
        this.modelCongress.start_date + "T10:00:00.000+00:00";
      this.modelCongress.end_date =
        this.modelCongress.end_date + "T15:00:00.000+00:00";

      let dataCongress = {
        congress: this.modelCongress,
      };

      this.congressService.postCongress(dataCongress).subscribe(
        (res) => {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Creación exitosa",
            showConfirmButton: false,
            timer: 1500,
          });
          this.router.navigate(["/dashboard/congresses"]);
        },
        (err) => {
          console.error(err);
        }
      );
    } else {
      Swal.fire({
        position: "top-end",
        icon: "warning",
        title: "Debes completar todos los datos",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }
}
