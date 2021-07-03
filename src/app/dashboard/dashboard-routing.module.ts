import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UsersComponent } from "./users/users.component";
import { PostulationsComponent } from "./postulations/postulations.component";
import { CongressesComponent } from "./congresses/congresses.component";
import { CreateCongressComponent } from "./congresses/create-congress/create-congress.component";
import { LinksComponent } from "./links/links.component";
import { PutCongressComponent } from "./congresses/put-congress/put-congress.component";
import { PostPostulationComponent } from "./postulations/post-postulation/post-postulation.component";
import { SpeakersComponent } from "./users/speakers/speakers.component";
import { ParticipantsComponent } from "./users/participants/participants.component";
import { PostLinkComponent } from "./links/post-link/post-link.component";
import { PutLinkComponent } from "./links/put-link/put-link.component";
import { PutUserComponent } from "./users/put-user/put-user.component";
import { NewReviewerComponent } from "./new-reviewer/new-reviewer.component";
import { ReviewerComponent } from "./users/reviewer/reviewer.component";
import { RubricComponent } from "./rubric/rubric.component";
import { AssignmentComponent } from './assignment/assignment.component';
import { ListTopicsComponent } from './list-topics/list-topics.component';
import { EvaluationComponent } from './evaluation/evaluation.component';

const routes: Routes = [
  { path: "users", component: UsersComponent },
  { path: "put-user/:id", component: PutUserComponent },
  { path: "speakers", component: SpeakersComponent },
  { path: "participants", component: ParticipantsComponent },
  { path: "postulations", component: PostulationsComponent },
  { path: "post-postulation", component: PostPostulationComponent },
  { path: "congresses", component: CongressesComponent },
  { path: "create-congress", component: CreateCongressComponent },
  { path: "put-congresses", component: PutCongressComponent },
  { path: "links", component: LinksComponent },
  { path: "post-link", component: PostLinkComponent },
  { path: "put-link/:idLink", component: PutLinkComponent },
  { path: "new-reviewer", component: NewReviewerComponent },
  { path: "reviewer", component: ReviewerComponent },
  { path: "rubric", component: RubricComponent },
  { path: "assignment", component: AssignmentComponent },
  { path: "list-topics", component: ListTopicsComponent },
  { path: "evaluation", component: EvaluationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
