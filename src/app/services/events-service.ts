import { Injectable, signal } from '@angular/core';

export interface Event {
  id: number;
  title: string;
  date: string;
  description: string;
  location: string;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  events = signal<Event[]>([]);

  loadEvents() {
    this.events.set([
      {
        id: 1,
        title: 'Diwali Celebration',
        date: '2025-12-24',
        description: 'Join us for a grand celebration of the Festival of Lights with music, dance, and food.',
        location: 'Campus Main Hall, Building A',
        imageUrl: 'https://placehold.co/600x400/2d1b4e/ffffff?text=Diwali+Celebration'
      },
      {
        id: 2,
        title: 'Holi Festival',
        date: '2026-03-16',
        description: 'Celebrate the festival of colors with us! Colors, music, and traditional sweets.',
        location: 'University Outdoor Grounds',
        imageUrl: 'https://placehold.co/600x400/1b3a1b/ffffff?text=Holi+Festival'
      },
      {
        id: 3,
        title: 'Cultural Night',
        date: '2025-11-10',
        description: 'Experience the rich culture of India through music, dance and art performances.',
        location: 'Campus Auditorium',
        imageUrl: 'https://placehold.co/600x400/3a1b1b/ffffff?text=Cultural+Night'
      },
      {
        id: 4,
        title: 'Diwali Celebration',
        date: '2025-10-20',
        description: 'A traditional Diwali celebration with rangoli, diyas, sweets and live music.',
        location: 'Student Union Hall',
        imageUrl: 'https://placehold.co/600x400/1b1b3a/ffffff?text=Diwali'
      },
      {
        id: 5,
        title: 'Sports Fest',
        date: '2025-09-14',
        description: 'Annual sports day with cricket, kabaddi and friendly competitions.',
        location: 'University Sports Complex',
        imageUrl: 'https://placehold.co/600x400/1a2e1a/ffffff?text=Sports+Fest'
      },
      {
        id: 6,
        title: 'Indo-German Friendship Evening',
        date: '2025-11-15',
        description: 'A cultural exchange evening celebrating both Indian and German traditions.',
        location: 'International Student Center',
        imageUrl: 'https://placehold.co/600x400/2e1a1a/ffffff?text=Indo-German+Evening'
      }
    ]);
  }
}
