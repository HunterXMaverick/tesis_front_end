import { Component, OnInit } from '@angular/core';
import { PersonService } from '../../services/person.service';
import { CongressService } from 'src/app/services/congress.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AssignmentService } from 'src/app/services/assignment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.scss'],
})
export class AssignmentComponent implements OnInit {
  postulation: FormGroup | undefined;
  users: any = [];
  congress: any = [];
  knowledge_area: Array<string> = [];
  selected_knowledge_area: string = '';
  selected_reviewer: string = '';
  assignmentReviewers: Array<any> = [];

  constructor(
    private personService: PersonService,
    private congressService: CongressService,
    private assignmentService: AssignmentService,
    public fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getCongress();
    this.getUsers();
    this.getAssignments();
  }

  getCongress() {
    return this.congressService.getCongress().subscribe(
      (res: any) => {
        this.congress = res.data[0];
        this.knowledge_area = this.congress.knowledge_area.split(',');
      },
      (err) => console.error(err)
    );
  }

  getUsers() {
    return this.personService.getUsers().subscribe(
      (res: any) => {
        res.data.forEach((element: any) => {
          if (element.rol == 'Revisor') {
            this.users.push(element);
          }
        });
      },
      (err) => console.error(err)
    );
  }

  getAssignments() {
    return this.assignmentService.getAssignments().subscribe(
      (res: any) => {
        this.assignmentReviewers = res.data;
      },
      (err) => console.error(err)
    );
  }

  postAssignment() {
    let continueProcess: boolean = true;

    for (let index = 0; index < this.assignmentReviewers.length; index++) {
      const element = this.assignmentReviewers[index];
      if (element.reviewer_name == this.selected_reviewer) {
        continueProcess = false;
      }
    }

    if (this.selected_reviewer != '' && this.selected_knowledge_area != '') {
      if (continueProcess) {
        let dataAssignment = {
          assigment: {
            reviewer_name: this.selected_reviewer,
            knowledge_area: this.selected_knowledge_area,
          },
        };

        this.assignmentService.postAssignment(dataAssignment).subscribe(
          (res: any) => {
            this.getAssignments();
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Revisor asignado correctamente.',
              showConfirmButton: false,
              timer: 1500,
            });
          },
          (err) => console.error(err)
        );
      } else {
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'Revisor actuamente asignado, selecciona otro para continuar.',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } else {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Rellene todos los campos para continuar.',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }
}
