import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';


export interface Event {
  id: number;
  title: string;
  eventDate: string;
  description: string;
  location: string;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7205/api/events';


  upcomingEvents = signal<Event[]>([]);
  pastEvents = signal<Event[]>([]);


  loadUpcomingEvents() {
    // Loading the events from API
    this.http.get<Event[]>(this.apiUrl+'/upcoming').subscribe((data) => {
      this.upcomingEvents.set(data);
    });
  }
  loadPastEvents() {
    // Loading the events from API
    this.http.get<Event[]>(this.apiUrl+'/past').subscribe((data) => {
      this.pastEvents.set(data);
    });
  }
}
