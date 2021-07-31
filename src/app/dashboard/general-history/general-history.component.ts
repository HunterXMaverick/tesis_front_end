import { Component, OnInit } from '@angular/core';
import { CongressService } from '../../services/congress.service';
import { ConferenceService } from '../../services/conference.service';
import { PostulationService } from '../../services/postulation.service';
import { QualificationService } from 'src/app/services/qualification';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-general-history',
  templateUrl: './general-history.component.html',
  styleUrls: ['./general-history.component.scss']
})
export class GeneralHistoryComponent implements OnInit {
  congress: any = [];
  congressData: any = [];
  postulationData: Array<any> = [];
  conferencesData: Array<any> = [];
  dataUser: any;

  constructor(
    private conferenceService: ConferenceService,
    private congressService: CongressService,
    private postulationService: PostulationService,
    private qualificationService: QualificationService,
  ) {
    this.getCongress();
    this.dataUser = JSON.parse(sessionStorage.getItem('_user-data')!);
    console.log(this.dataUser);
  }

  ngOnInit(): void {
    this.handleModalParticipante(false);
    this.handleModalRevisor(false);
  }

  // getCongress() {
  //   return this.congressService.getCongress().subscribe(
  //     (res: any) => {
  //       this.congress = res.data;
  //     }
  //   )
  // }

  getCongress() {
    return this.congressService.getCongress().subscribe(
      (res: any) => {
        if (res.data.length == 0) {
          this.congress = null;
        } else {
          res.data.forEach((element: any) => {
            if (
              element.status_congress == 'Inhabilitado'
            ) {
              this.congress.push(element);
            }
          });
          console.log(this.congress)
        }
      },
      (err) => console.error(err)
    );
  }

  getGeneralHistoryParticipante(id: string) {
    this.conferenceService.getConference().subscribe(
      (res: any) => {
        res.data.forEach(
          (conference: any) => {

            console.log(conference.congress_id)
            console.log(id)
            if (conference.congress_id == id) {
              this.conferencesData.push(conference);
            }
          })
      });

    this.postulationService.getPostulations().subscribe(
      (res: any) => {
        res.data.forEach(
          (postulation: any) => {
            console.log(postulation.congress_id)
            if (postulation.congress_id == id) {
              this.postulationData.push(postulation);
            }
          })
      });
  }


  getGeneralHistoryRevisor(id: string) {
    this.postulationService.getPostulations().subscribe(
      (res: any) => {
        res.data.forEach(
          (postulation: any) => {
            if (postulation.congress_id == id) {
              this.postulationData.push(postulation);
            }
          })
      });
  }

  showGrade(id: string) {
    this.qualificationService.getQualification().subscribe((response: any) => {
      response.data.forEach((element: any) => {
        if (element.postulation_id == id) {
          Swal.fire({
            position: 'center',
            icon: 'info',
            title: `Su calificación final es: ${element.qualificaty}`,
            showConfirmButton: true,
            timer: 3000,
          });
        }
      });
    });
  }

  handleModalParticipante(showModalP: boolean) {
    let modal: any = document.getElementById('modal');

    if (showModalP) {
      modal.classList.remove('hidden');
    } else {
      modal.classList.add('hidden');
    }
  }

  handleModalRevisor(showModalR: boolean) {
    let modal: any = document.getElementById('modalRevisor');

    if (showModalR) {
      modal.classList.remove('hidden');
    } else {
      modal.classList.add('hidden');
    }
  }


}
