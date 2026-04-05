import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventsService, Event } from '../../../services/events-service';
import { UserService } from '../../../services/user-service';
import { DatePipe } from '@angular/common';
import QRCode from 'qrcode';


@Component({
  selector: 'app-event-register',
  imports: [DatePipe, RouterLink],
  templateUrl: './event-register.html',
  styleUrl: './event-register.scss',
})
export class EventRegister implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private eventsService = inject(EventsService);
  userService = inject(UserService);

  event = signal<Event | null>(null);
  alreadyRegistered = signal(false);

  guestStep = signal<'form' | 'otp' | 'done'>('form');
  guestName = signal('');
  guestEmail = signal('');
  guestOrg = signal('');
  guestOtp = signal('');

  guestQRDataUrl = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.eventsService.getEventById(id).subscribe({
      next: (data) => {
        this.event.set(data);
        const user = this.userService.currentUser();
        if (user) {
          this.eventsService.isUserRegistered(user.id, id).subscribe(registered => {
            this.alreadyRegistered.set(registered);
          });
        }
      },
      error: () => alert('Event not found.')
    });
  }

  onRegister() {
    const user = this.userService.currentUser();
    const eventData = this.event();

    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.eventsService.registerForEvent(user.id, eventData!.id).subscribe({
      next: () => {
        this.alreadyRegistered.set(true);
        alert('You have successfully registered for this event!');
      },
      error: () => alert('Registration failed. You may already be registered.')
    });
  }

  onSendOtp(name: string, email: string, org: string) {
    this.guestName.set(name);
    this.guestEmail.set(email);
    this.guestOrg.set(org);

    this.eventsService.sendGuestOtp(email, this.event()!.id, name, org).subscribe({
      next: () => {
        this.guestStep.set('otp');
        alert('OTP sent to your email!');
      },
      error: (err) => {
        if (err.status === 409) alert('This email is already registered for this event.');
        else alert('Failed to send OTP. Please try again.');
      }
    });
  }

  onVerifyOtp(otpCode: string) {
  this.eventsService.verifyGuestOtp(
    this.guestEmail(),
    this.event()!.id,
    otpCode,
    this.guestName(),
    this.guestOrg()
  ).subscribe({
    next: async () => {
      this.guestStep.set('done');
      const data = JSON.stringify({
        name: this.guestName(),
        email: this.guestEmail(),
        organization: this.guestOrg(),
        event: this.event()!.title,
        date: this.event()!.eventDate,
        location: this.event()!.location
      });
      const url = await QRCode.toDataURL(data, { width: 250, margin: 2 });
      this.guestQRDataUrl.set(url);
    },
    error: (err) => {
      if (err.status === 400) alert(err.error);
      else alert('Verification failed. Please try again.');
    }
  });
  }

}
