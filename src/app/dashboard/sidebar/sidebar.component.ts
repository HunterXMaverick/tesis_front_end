import { Component } from '@angular/core';
import { CongressService } from 'src/app/services/congress.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  dataUser: any;
  showSidebar: boolean;
  congressCreated: boolean = false;

  constructor(private congressService: CongressService) {
    this.dataUser = JSON.parse(sessionStorage.getItem('_user-data')!);
    this.showSidebar = true;
    this.getCongress();
  }

  handleSidebar() {
    let sidebar: any = document.getElementById('menu');

    if (this.showSidebar) {
      sidebar.classList.add('hidden');
      this.showSidebar = false;
    } else {
      sidebar.classList.remove('hidden');
      this.showSidebar = true;
    }
  }

  getCongress() {
    return this.congressService.getCongress().subscribe(
      (res: any) => {
        if (res.data.length == 0) {
          this.congressCreated = false;
        } else if (res.data.length >= 1) {
          this.congressCreated = true;
        }
        console.log(this.congressCreated);
      },
      (err) => console.error(err)
    );
  }
}
