import { Component, OnInit } from '@angular/core';
import { PostulationService } from '../../../services/postulation.service';
import { ConferenceService } from '../../../services/conference.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-post-conference',
  templateUrl: './post-conference.component.html',
  styleUrls: ['./post-conference.component.scss'],
})
export class PostConferenceComponent implements OnInit {
  conference: FormGroup;
  dataUser: any = [];
  postulations: any = [];
  today = new Date().toISOString().split('T')[0];

  constructor(
    private postulationService: PostulationService,
    private conferenceService: ConferenceService,
    private router: Router,
    public fb: FormBuilder
  ) {
    this.dataUser = JSON.parse(sessionStorage.getItem('_user-data')!);
    this.conference = this.fb.group({
      link: ['', [Validators.required]],
      date: ['', [Validators.required]],
      hour: [null, [Validators.required]],
      postulation_id: ['', [Validators.required]],
      reviewer_id: [this.dataUser._id, [Validators.required]],
    });
  }

  ngOnInit() {
    this.getPostulation();
  }

  getPostulation() {
    return this.postulationService.getPostulations().subscribe((res: any) => {
      res.data.forEach((element: any) => {
        if (
          element.status == 'Aprobado' &&
          element.person_id == this.dataUser._id
        ) {
          this.postulations.push(element);
        }
      });
    });
  }

  postConference() {
    if (
      this.conference.get('link')?.valid &&
      this.conference.get('date')?.valid &&
      this.conference.get('hour')?.valid
    ) {
      let dataConference = {
        conference: this.conference.value,
      };
      console.log(dataConference);

      this.conferenceService.postConference(dataConference).subscribe(
        () => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Creación exitosa',
            showConfirmButton: false,
            timer: 1500,
          });
          this.router.navigate(['/dashboard/conference']);
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: 'Completa todos los campos para continuar.',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }

  goToVideoConferencePlatform(service: string) {
    switch (service) {
      case 'youtube':
        window.open(
          'https://studio.youtube.com/channel/UC0pXAJUUT0AXHTsAyLllYGg',
          '_blank'
        );
        break;

      case 'zoom':
        window.open('https://zoom.us', '_blank');
        break;

      case 'google-meet':
        window.open('https://meet.google.com', '_blank');
        break;

      case 'facebook':
        window.open(
          'https://www.facebook.com/live/producer/1157412241437715/?entry_point=feedx_sprouts',
          '_blank'
        );
        break;

      default:
        break;
    }
  }

  hours: Array<string> = [
    '00:00',
    '00:30',
    '01:00',
    '01:30',
    '02:00',
    '02:30',
    '03:00',
    '03:30',
    '04:00',
    '04:30',
    '05:00',
    '05:30',
    '06:00',
    '06:30',
    '07:00',
    '07:30',
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
    '20:00',
    '20:30',
    '21:00',
    '21:30',
    '22:00',
    '22:30',
    '23:00',
    '23:30',
  ];
}
