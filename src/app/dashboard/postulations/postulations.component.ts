import { Component, OnInit } from "@angular/core";
import { PostulationService } from "../../services/postulation.service";
import { PersonService } from "../../services/person.service";

@Component({
  selector: "app-postulations",
  templateUrl: "./postulations.component.html",
  styleUrls: ["./postulations.component.scss"],
})
export class PostulationsComponent implements OnInit {
  postulations: any = [];
  userById: any = [];
  personId: any;
  dataUser: any = [];
  projectsSpeaker: any = [];

  constructor(
    private postulationService: PostulationService,
    private personService: PersonService
  ) {}

  ngOnInit() {
    this.getUserByEmail();
    this.getPostulations();
  }

  getUserById(id: string) {
    return this.personService.getUserById(id).subscribe(
      (res: any) => {
        console.log(res.data)
        this.userById.push(res.data)
      },
      err => console.error(err)
    )
  }

  getPostulations() {
    return this.postulationService.getPostulations().subscribe(
      (res: any) => {
        this.postulations = res.data;
        this.postulations.forEach((element) => {
          this.getUserById(element.person_id);
          if (element.person_id == this.dataUser._id) {
            this.projectsSpeaker.push(element);
          }
        });
      },
      (err) => console.error(err)
    );
  }

  getUserId(id: string) {
    this.personId = id;
  }

  getUserByEmail() {
    return this.personService
      .getUserByEmail(this.personService.email)
      .subscribe(
        (res: any) => {
          this.dataUser = res.data;
        },
        (err) => console.error(err)
      );
  }
}
