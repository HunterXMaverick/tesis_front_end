import { Component, OnInit } from '@angular/core';
import { CongressService } from '../../services/congress.service';

@Component({
  selector: 'app-congresses',
  templateUrl: './congresses.component.html',
  styleUrls: ['./congresses.component.scss'],
})
export class CongressesComponent implements OnInit {
  persons: any = [];
  congress: any;
  dataUser: any;

  constructor(private congressService: CongressService) {
    this.dataUser = JSON.parse(sessionStorage.getItem('_user-data')!);
  }

  ngOnInit() {
    this.getCongress();
  }

  getCongress() {
    return this.congressService.getCongress().subscribe(
      (res: any) => {
        if (res.data.length == 0) {
          this.congress = null;
        } else if (res.data.length >= 1) {
          this.congress = res.data[0];
        }
      },
      (err) => console.error(err)
    );
  }
}
