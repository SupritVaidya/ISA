import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { EventsService } from '../../services/events-service';

@Component({
  selector: 'app-events',
  imports: [DatePipe],
  templateUrl: './events.html',
  styleUrl: './events.scss',
})
export class Events implements OnInit {

  eventService = inject(EventsService);
  events = this.eventService.events;

  badgeColors = ['badge-purple', 'badge-green', 'badge-orange'];

  ngOnInit() {
    this.eventService.loadEvents();
  }
}
