import { Component, OnInit } from "@angular/core";
import { PersonService } from "../../services/person.service";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  email: string;
  dataUser: any = [];

  constructor(private personService: PersonService) {
    this.email = personService.email;
  }

  ngOnInit() {
    this.getPersonByEmail();
  }

  getPersonByEmail() {
    return this.personService.getUserByEmail(this.email).subscribe(
      (res: any) => {
        this.dataUser = res.data;
      },
      (err) => console.error(err)
    );
  }
}
