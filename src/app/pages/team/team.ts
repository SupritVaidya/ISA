import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TeamService } from '../../services/team-service';

@Component({
  selector: 'app-team',
  imports: [RouterLink],
  templateUrl: './team.html',
  styleUrl: './team.scss',
})
export class Team implements OnInit {

  teamsService = inject(TeamService);
  teamMembers = this.teamsService.teamMembers;

  ngOnInit() {
    this.teamsService.loadTeamMembers();
  }
}
