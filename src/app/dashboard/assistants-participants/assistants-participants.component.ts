import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { PostulationPasticipantsService } from 'src/app/services/postulationPasticipants.service';
import { PersonService } from 'src/app/services/person.service';

@Component({
  selector: 'app-assistants-participants',
  templateUrl: './assistants-participants.component.html',
  styleUrls: ['./assistants-participants.component.scss'],
})
export class AssistantsParticipantsComponent implements OnInit {
  participantsPostulations: any = [];
  dataUser: any = [];
  names: any = '';
  last_names: any = '';
  postulation_id: string = '';

  constructor(
    private postulationParticipantsService: PostulationPasticipantsService,
    private personsService: PersonService
  ) {
    this.dataUser = JSON.parse(sessionStorage.getItem('_user-data')!);
    this.postulation_id = localStorage.getItem('postulation_id')!;
    localStorage.removeItem('postulation_id');
  }

  ngOnInit() {
    this.getPostulationParticipantsService();
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
      postulationParticipants: { status },
    };

    this.postulationParticipantsService
      .putPostulationParticipants(id, data)
      .subscribe(
        (res: any) => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: `Participante ${status}.`,
            showConfirmButton: false,
            timer: 1500,
          });
          this.getPostulationParticipantsService();
        },
        (error) => console.error(error)
      );
  }
}
