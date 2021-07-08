import { Component, OnInit } from '@angular/core';
import { PostulationService } from '../../../services/postulation.service';
import { ConferenceService } from '../../../services/conference.service';
import { Conference } from '../../../models/conference';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-post-conference',
  templateUrl: './post-conference.component.html',
  styleUrls: ['./post-conference.component.scss']
})
export class PostConferenceComponent implements OnInit {

  postulations: any = [];
  conference: any = [];
  today = new Date().toISOString().split("T")[0];

  modelConference: Conference = {
    link: "",
    start_date: "",
    end_date: "",
    hour: "",
    postulation_id: ""
  }

  constructor(
    private postulationService: PostulationService,
    private conferenceService: ConferenceService,
    private router: Router,
    public fb: FormBuilder
  ) { }

  ngOnInit(): void {
  }

  getPostulation() {
    return this.postulations.getPostulations().subscribe(
      (res: any) => {
        this.postulations = res.data;
      });
  }

  postConference() {
    if (
      this.modelConference.link &&
      this.modelConference.start_date &&
      this.modelConference.end_date &&
      this.modelConference.hour 
    ) {
      this.modelConference.start_date =
        this.modelConference.start_date + "T10:00:00.000+00:00";
      this.modelConference.end_date =
        this.modelConference.end_date + "T15:00:00.000+00:00";

      let dataConference = {
        conference: this.modelConference,
      };

      this.conferenceService.postConference(dataConference).subscribe(
        (res) =>{
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Creación exitosa",
            showConfirmButton: false,
            timer: 1500,
          });
          this.router.navigate(["/dasdashboard/conference"])
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      Swal.fire({
        position: "top-end",
        icon: "warning",
        title: "Debes completar todos los datos",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }
}
