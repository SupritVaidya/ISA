import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-registrations',
  imports: [DatePipe, RouterLink],
  templateUrl: './registrations.html',
  styleUrl: './registrations.scss',
})
export class Registrations implements OnInit {

  private http = inject(HttpClient);

  memberRegistrations = signal<any[]>([]);
  guestRegistrations = signal<any[]>([]);
  activeTab = signal<'all' | 'members' | 'guests' | 'byEvent'>('all');


  allRegistrations = computed(() => [
  ...this.memberRegistrations().map(r => ({
    name: `${r.user.firstName} ${r.user.lastName}`,
    email: r.user.email,
    type: 'Member',
    event: r.event.title,
    eventDate: r.event.eventDate,
    registeredAt: r.registeredAt
  })),
  ...this.guestRegistrations().map(r => ({
    name: r.name,
    email: r.email,
    type: 'Guest',
    event: r.event.title,
    eventDate: r.event.eventDate,
    registeredAt: r.registeredAt
  }))
]);


exportAll() {
  const ws = XLSX.utils.json_to_sheet(this.allRegistrations().map(r => ({
    Type: r.type,
    Name: r.name,
    Email: r.email,
    Event: r.event,
    'Event Date': r.eventDate,
    'Registered At': r.registeredAt
  })));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'All Registrations');
  XLSX.writeFile(wb, 'all-registrations.xlsx');
}

exportMembers() {
  const ws = XLSX.utils.json_to_sheet(this.memberRegistrations().map(r => ({
    Name: `${r.user.firstName} ${r.user.lastName}`,
    Email: r.user.email,
    'Student ID': r.user.studentId || '',
    Event: r.event.title,
    'Event Date': r.event.eventDate,
    'Registered At': r.registeredAt
  })));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Member Registrations');
  XLSX.writeFile(wb, 'member-registrations.xlsx');
}

byEvent = computed(() => {
  const map = new Map<string, any[]>();
  for (const r of this.allRegistrations()) {
    if (!map.has(r.event)) map.set(r.event, []);
    map.get(r.event)!.push(r);
  }
  return Array.from(map.entries()).map(([event, registrations]) => ({ event, registrations }));
});


  exportGuests() {
    const ws = XLSX.utils.json_to_sheet(this.guestRegistrations().map(r => ({
      Name: r.name,
      Email: r.email,
      Organization: r.organization || '',
      Event: r.event.title,
      'Event Date': r.event.eventDate,
      'Registered At': r.registeredAt
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Guest Registrations');
    XLSX.writeFile(wb, 'guest-registrations.xlsx');
  }


  

  ngOnInit(): void {
  this.http.get<any[]>('https://localhost:7205/api/eventregistrations/details').subscribe({
    next: (data) => this.memberRegistrations.set(data),
    error: () => alert('Failed to load member registrations.')
  });

  this.http.get<any[]>('https://localhost:7205/api/guestregistrations/details').subscribe({
    next: (data) => this.guestRegistrations.set(data),
    error: () => alert('Failed to load guest registrations.')
  });
}

}
