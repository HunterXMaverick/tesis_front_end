import {Component, OnInit} from '@angular/core';
import {CongressService} from '../../services/congress.service';
import {PersonService} from '../../services/person.service';

@Component({
  selector: 'app-congresses',
  templateUrl: './congresses.component.html',
  styleUrls: ['./congresses.component.scss']
})
export class CongressesComponent implements OnInit {

  persons: any = []
  congress: any = []
  dataUser: any = []
  dataOrganizer: any = []

  constructor(
    private congressService: CongressService,
    private personService: PersonService
  ) {
  }

  ngOnInit() {
    this.getCongress();
    this.getPersonByEmail();
    this.getOrganizer();
  }

  getCongress() {
    return this.congressService.getCongress().subscribe(
      res => {
        this.congress = res;
      },
      err => console.error(err)
    )
  }

  getPersonByEmail() {
    return this.personService.getUserByEmail(this.personService.email).subscribe(
      res => {
        this.dataUser = res
      },
      err => console.error(err)
    )
  }

  getOrganizer() {
    return this.personService.getUsers().subscribe(
      res => {
        this.persons = res
        this.persons.persons.forEach(element => {
            if (element.rol == 'Organizador') {
              this.dataOrganizer = element
            }
          }
        )
      },
      err => console.error(err)
    )
  }
}
