import { Component, OnInit } from '@angular/core';
import { PersonService } from "../../services/person.service";
import { CongressService } from "src/app/services/congress.service";
import { FormBuilder, FormGroup } from "@angular/forms";


@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.scss']
})
export class AssignmentComponent implements OnInit {
  postulation: FormGroup;
  users: any = [];
  congress: any = [];
  knowledge_area: Array<string>;

  constructor(
    private personService: PersonService,
    private congressService: CongressService,
    public fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getCongress();
    this.getUsers();
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

  getUsers() {
    return this.personService.getUsers().subscribe(
      (res: any) => {
        this.users = res.data;
        
      },
      (err) => console.error(err)
    );
  }

  

}
