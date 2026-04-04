import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';



export interface Event {
  id: number;
  title: string;
  eventDate: string;
  description: string;
  location: string;
  imageUrl: string;
}

export interface EventRegistration {
  id: number;
  userId: number;
  eventId: number;
  registeredAt: string;
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
    // Loading the upcoming events from API
    this.http.get<Event[]>(this.apiUrl+'/upcoming').subscribe((data) => {
      this.upcomingEvents.set(data);
    });
  }
  loadPastEvents() {
    // Loading the past events from API
    this.http.get<Event[]>(this.apiUrl+'/past').subscribe((data) => {
      this.pastEvents.set(data);
    });
  }

  isUserRegistered(userId: number, eventId: number) {
    return this.http.get<EventRegistration[]>(`https://localhost:7205/api/eventregistrations/user/${userId}`).pipe(
    map(registrations => registrations.some(r => r.eventId === eventId))
  );
}


  getEventById(id: number) {
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }

  getMyRegistrations(userId: number) {
    return this.http.get<EventRegistration[]>(`https://localhost:7205/api/eventregistrations/user/${userId}`);
  }

  sendGuestOtp(email: string, eventId: number, name: string, organization: string) {
  return this.http.post('https://localhost:7205/api/guestregistrations/send-otp', {
    email, eventId, name, organization
    }, { responseType: 'text' });
  }

verifyGuestOtp(email: string, eventId: number, otpCode: string, name: string, organization: string) {
  return this.http.post('https://localhost:7205/api/guestregistrations/verify', {
    email, eventId, otpCode, name, organization
    });
  }

  postEvent(event: { title: string; eventDate: string; location: string; description: string; imageUrl: string }) {
  return this.http.post<Event>(this.apiUrl, event);
  }




  registerForEvent(userId: number, eventId: number) {
    return this.http.post('https://localhost:7205/api/eventregistrations', {
    userId,
    eventId,
    registeredAt: new Date().toISOString()
    });
  }


}
