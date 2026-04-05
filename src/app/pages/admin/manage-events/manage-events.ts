import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventsService, Event } from '../../../services/events-service';

@Component({
  selector: 'app-manage-events',
  imports: [RouterLink, CommonModule],
  templateUrl: './manage-events.html',
  styleUrl: './manage-events.scss',
})
export class ManageEvents implements OnInit {
  private eventsService = inject(EventsService);

  events: Event[] = [];
  loading = true;
  deletingId: number | null = null;

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.loading = true;
    this.eventsService.getAllEvents().subscribe({
      next: (data) => {
        this.events = data.sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  deleteEvent(id: number, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;

    this.deletingId = id;
    this.eventsService.deleteEvent(id).subscribe({
      next: () => {
        this.events = this.events.filter(e => e.id !== id);
        this.deletingId = null;
      },
      error: () => {
        alert('Failed to delete event.');
        this.deletingId = null;
      }
    });
  }
}
