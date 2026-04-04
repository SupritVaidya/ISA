import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { EventsService, EventRegistration, Event } from '../../services/events-service';
import { UserService } from '../../services/user-service';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import QRCode from 'qrcode';


@Component({
  selector: 'app-my-registrations',
  imports: [DatePipe, RouterLink],
  templateUrl: './my-registrations.html',
  styleUrl: './my-registrations.scss',
})
export class MyRegistrations implements OnInit {

  private router = inject(Router);
  private eventsService = inject(EventsService);
  private userService = inject(UserService);

  registeredEvents = signal<{ reg: EventRegistration, event: Event }[]>([]);
  badgeColors = ['badge-purple', 'badge-green', 'badge-orange'];
  activeQR = signal<{ regId: number; dataUrl: string } | null>(null);




  ngOnInit(): void {
    const user = this.userService.currentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.eventsService.getMyRegistrations(user.id).subscribe(regs => {
      regs.forEach(reg => {
        this.eventsService.getEventById(reg.eventId).subscribe(event => {
          this.registeredEvents.update(list => [...list, { reg, event }]);
        });
      });
    });
  }

  async toggleQR(item: { reg: EventRegistration; event: Event }) {
  if (this.activeQR()?.regId === item.reg.id) {
    this.activeQR.set(null);
    return;
  }

  const user = this.userService.currentUser();
  const data = JSON.stringify({
    name: `${user?.firstName} ${user?.lastName}`,
    email: user?.email,
    studentId: user?.studentId,
    event: item.event.title,
    date: item.event.eventDate,
    location: item.event.location
  });

  const dataUrl = await QRCode.toDataURL(data, { width: 250, margin: 2 });
  this.activeQR.set({ regId: item.reg.id, dataUrl });
}


}
