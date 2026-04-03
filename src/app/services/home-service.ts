import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
 
  eventsCount = signal(0);
  blogPostsCount = signal(0);
  membersCount = signal(0);
  loading = signal(false);

  loadStats() {
    this.loading.set(true);
    this.eventsCount.set(42);
    this.blogPostsCount.set(17);
    this.membersCount.set(256);
    this.loading.set(false);
  }

}
