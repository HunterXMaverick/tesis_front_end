import { Component, OnInit } from "@angular/core";
import { Postulation } from "../../../models/postulation";
import { PostulationService } from "../../../services/postulation.service";
import { PersonService } from "../../../services/person.service";
import { CongressService } from "src/app/services/congress.service";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: "app-post-postulation",
  templateUrl: "./post-postulation.component.html",
  styleUrls: ["./post-postulation.component.scss"],
})
export class PostPostulationComponent implements OnInit {
  dataUser: any = [];
  congress: any = [];
  knowledge_area: Array<string>;
  postulation: Postulation = {
    title_project: "",
    summary_project: "",
    knowledge_area: "",
    person_id: "",
  };

  constructor(
    private postulationService: PostulationService,
    private personService: PersonService,
    private congressService: CongressService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getPersonByEmail();
    this.getCongress();
  }

  getPersonByEmail() {
    return this.personService
      .getUserByEmail(this.personService.email)
      .subscribe(
        (res: any) => {
          this.dataUser = res.data;
        },
        (err) => console.error(err)
      );
  }

  getCongress() {
    return this.congressService.getCongress().subscribe(
      (res: any) => {
        this.congress = res.data[0];
        this.knowledge_area = this.congress.knowledge_area.split(",");
      },
      (err) => console.error(err)
    );
  }

  postPostulation() {
    if (
      this.postulation.title_project &&
      this.postulation.summary_project &&
      this.postulation.knowledge_area
    ) {
      this.postulation.person_id = this.dataUser._id;
      let dataPostulation = {
        postulation: this.postulation,
      };
      Swal.fire({
        title: "¿Está seguro de generar el proyecto?",
        text: "¡No podrá editarlo una vez generado!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Enviar",
      }).then((result) => {
        if (result.isConfirmed) {
          this.postulationService.postPostulation(dataPostulation).subscribe(
            (res) => {
              this.router.navigate(["/dashboard/postulations"]);
            },
            (err) => {
              console.error(err);
            }
          );
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "¡Registro Exitoso!",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
    } else {
      Swal.fire({
        position: "top-end",
        icon: "warning",
        title: "Por favor, completar todos los datos",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }
}
