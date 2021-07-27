import { Component, OnInit } from '@angular/core';
import { Congress } from 'src/app/models/congress';
import { CongressService } from '../../services/congress.service';

@Component({
  selector: 'app-general-history',
  templateUrl: './general-history.component.html',
  styleUrls: ['./general-history.component.scss']
})
export class GeneralHistoryComponent implements OnInit {
  congress: any = [];

  constructor(private congressService: CongressService) {
    this.getCongress();
  }

  ngOnInit(): void { }

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
              // element.person_id == this.dataUser._id &&
              // element._id == this.congress &&
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

}
