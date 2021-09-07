import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { PostulationPasticipantsService } from 'src/app/services/postulationPasticipants.service';
import { PersonService } from 'src/app/services/person.service';
import { CongressService } from 'src/app/services/congress.service';

@Component({
  selector: 'app-assistants-participants',
  templateUrl: './assistants-participants.component.html',
  styleUrls: ['./assistants-participants.component.scss'],
})
export class AssistantsParticipantsComponent implements OnInit {
  congressSelected: any;
  congress: any;
  participantsPostulations: any = [];
  dataUser: any = [];
  names: any = '';
  last_names: any = '';
  postulation_id: string = '';

  constructor(
    private postulationParticipantsService: PostulationPasticipantsService,
    private congressService: CongressService,
    private personsService: PersonService
  ) {
    this.dataUser = JSON.parse(sessionStorage.getItem('_user-data')!);
    this.postulation_id = localStorage.getItem('postulation_id')!;
    localStorage.removeItem('postulation_id');
    this.congressSelected = sessionStorage.getItem('activeCongress');
    this.getCongress();
  }

  ngOnInit() {
    this.getPostulationParticipantsService();
  }

  getCongress() {
    return this.congressService.getCongress().subscribe(
      (res: any) => {
        if (res.data.length == 0) {
          this.congress = null;
        } else {
          res.data.forEach((element: any) => {
            if (
              element.person_id == this.dataUser._id &&
              element.status_congress == 'Habilitado'
            ) {
              this.congress = element;
            }
          });
        }
      },
      (err) => console.error(err)
    );
  }

  getPostulationParticipantsService() {
    this.participantsPostulations = [];
    let data: any;

    this.postulationParticipantsService
      .getPostulationParticipantsController()
      .subscribe((response: any) => {
        response.data.forEach((element: any) => {
          if (element.postulation_id == this.postulation_id) {
            this.personsService
              .getUserById(element.person_id)
              .subscribe((res: any) => {
                data = {
                  _id: element._id,
                  name: `${res.data.last_names} ${res.data.names}`,
                  title: res.data.title,
                  status: element.status,
                };
                this.participantsPostulations.push(data);
              });
          }
        });
      });
  }

  approveRejectParticipation(id: string, status: string) {
    let data = {
      postulationParticipants: { status, congress_id: this.congressSelected },
    };

    this.postulationParticipantsService
      .putPostulationParticipants(id, data)
      .subscribe(
        () => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: `Participante ${status}.`,
            showConfirmButton: false,
            timer: 1500,
          }).then(() => this.getPostulationParticipantsService());
        },
        (error) => console.error(error)
      );
  }
}
