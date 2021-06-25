import { Component } from "@angular/core";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent {
  dataUser: any;

  constructor() {
    this.dataUser = JSON.parse(sessionStorage.getItem("_user-data"));
  }
}
