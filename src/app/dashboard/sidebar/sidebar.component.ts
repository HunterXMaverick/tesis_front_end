import { Component } from '@angular/core';
import { CongressService } from 'src/app/services/congress.service';
import { PersonService } from 'src/app/services/person.service';
import { PostulationService } from 'src/app/services/postulation.service';
import { RubricService } from 'src/app/services/rubric.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  congressEnabled: boolean = true;
  dataUser: any;
  showSidebar: boolean;
  congressCreated: boolean = false;
  rubricCreated: boolean = false;
  reviewersCreated: boolean = false;
  postulationsCreated: boolean = false;
  profile_picture_url: string = '';

  constructor(
    private congressService: CongressService,
    private rubricService: RubricService,
    private personService: PersonService,
    private postulationService: PostulationService
  ) {
    this.dataUser = JSON.parse(sessionStorage.getItem('_user-data')!);
    this.showSidebar = true;
    this.getUserProfilePic();
    this.getCongress();
    this.getRubric();
    this.getReviewers();
    // this.getPostulations();
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
      async (res: any) => {
        if ((await res.data.length) == 0) {
          this.congressCreated = false;
        } else if ((await res.data.length) >= 1) {
          this.congressCreated = true;
          this.congressEnabled = res.data[0].status_congress;
        }
      },
      (err) => console.error(err)
    );
  }

  getRubric() {
    return this.rubricService.getRubrics().subscribe(
      async (res: any) => {
        if ((await res.data.length) == 0) {
          this.rubricCreated = false;
        } else if ((await res.data.length) >= 1) {
          this.rubricCreated = true;
        }
      },
      (err) => console.error(err)
    );
  }

  getReviewers() {
    return this.personService.getReviewers().subscribe(
      async (res: any) => {
        if ((await res.data.length) == 0) {
          this.reviewersCreated = false;
        } else if ((await res.data.length) >= 1) {
          this.reviewersCreated = true;
        }
      },
      (err) => console.error(err)
    );
  }

  getPostulations() {
    return this.postulationService.getPostulations().subscribe(
      async (res: any) => {
        if ((await res.data.length) == 0) {
          this.postulationsCreated = false;
        } else if ((await res.data.length) >= 1) {
          this.postulationsCreated = true;
        }
      },
      (err) => console.error(err)
    );
  }

  getUserProfilePic() {
    return this.personService
      .getUserById(this.dataUser._id)
      .subscribe((res: any) => {
        if (res.data.profile_picture) {
          this.profile_picture_url = `http://localhost:3500/api/file/${res.data.profile_picture}`;
        } else {
          this.profile_picture_url = `https://upload.wikimedia.org/wikipedia/commons/7/72/Default-welcomer.png`;
        }
      });
  }
}
