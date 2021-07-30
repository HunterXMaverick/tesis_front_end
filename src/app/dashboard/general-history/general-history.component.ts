import { Component, OnInit } from '@angular/core';
import { CongressService } from '../../services/congress.service';
import { ConferenceService } from '../../services/conference.service';
import { PostulationService } from '../../services/postulation.service';


@Component({
  selector: 'app-general-history',
  templateUrl: './general-history.component.html',
  styleUrls: ['./general-history.component.scss']
})
export class GeneralHistoryComponent implements OnInit {
  congress: any = [];
  congressData: any = [];
  postulationData: any = [];
  conferencesData: Array<any> = [];

  constructor(
    private conferenceService: ConferenceService,
    private congressService: CongressService
    ) {
    this.getCongress();
  }

  ngOnInit(): void { 
    this.handleModal(false);
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

  getPostulationById(_id: string) {
    return this.congressService.getCongress().subscribe(
      (res: any) => {
        this.postulationData = res.data;
      }
    )
  }

  getConferenceById(){
    return this.conferenceService.getConference().subscribe((res: any) => {
      res.data.forEach((element: any) => {
        if (
          element.congress_id == this.congressData
        ) {
          this.conferencesData.push(element);
        }
      });
    });
  }

  

  handleModal(showModal: boolean) {
    let modal: any = document.getElementById('modal');

    if (showModal) {
      modal.classList.remove('hidden');
    } else {
      modal.classList.add('hidden');
    }
  }


}
