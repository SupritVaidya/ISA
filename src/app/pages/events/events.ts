import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventsService } from '../../services/events-service';

@Component({
  selector: 'app-events',
  imports: [DatePipe, RouterLink],
  templateUrl: './events.html',
  styleUrl: './events.scss',
})
export class Events implements OnInit {

  eventService = inject(EventsService);
  upcomingEvents = this.eventService.upcomingEvents;
  pastEvents = this.eventService.pastEvents;

  showAll = signal(false);

  visibleEvents = computed(() =>
  this.showAll() ? this.upcomingEvents() : this.upcomingEvents().slice(0, 3)
  );



  badgeColors = ['badge-purple', 'badge-green', 'badge-orange'];

  ngOnInit() {
    this.eventService.loadUpcomingEvents();
    this.eventService.loadPastEvents();
  }
}
