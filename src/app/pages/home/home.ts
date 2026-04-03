import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HomeService } from '../../services/home-service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {

  homeService = inject(HomeService);
  
  ngOnInit() {
    this.homeService.loadStats();
  }

  eventsCount = this.homeService.eventsCount;
  blogPostsCount = this.homeService.blogPostsCount
  membersCount = this.homeService.membersCount;

}
