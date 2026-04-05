import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventsService } from '../../../services/events-service';

@Component({
  selector: 'app-edit-event',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './edit-event.html',
  styleUrl: './edit-event.scss',
})
export class EditEvent implements OnInit {
  private eventsService = inject(EventsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  eventId!: number;
  loading = true;

  editEventForm = new FormGroup({
    title: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    location: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    imageUrl: new FormControl(''),
    driveUrl: new FormControl('')
  });

  get title() { return this.editEventForm.get('title'); }
  get date() { return this.editEventForm.get('date'); }
  get location() { return this.editEventForm.get('location'); }
  get description() { return this.editEventForm.get('description'); }

  ngOnInit() {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.eventsService.getEventById(this.eventId).subscribe({
      next: (event) => {
        this.editEventForm.patchValue({
          title: event.title,
          date: event.eventDate.substring(0, 10),
          location: event.location,
          description: event.description,
          imageUrl: event.imageUrl,
          driveUrl: event.driveUrl
        });
        this.loading = false;
      },
      error: () => {
        alert('Failed to load event.');
        this.router.navigate(['/admin/manage-events']);
      }
    });
  }

  onSubmit() {
    if (this.editEventForm.invalid) return;

    const formValue = this.editEventForm.value;
    const updated = {
      id: this.eventId,
      title: formValue.title!,
      eventDate: formValue.date!,
      location: formValue.location!,
      description: formValue.description!,
      imageUrl: formValue.imageUrl || '',
      driveUrl: formValue.driveUrl || ''
    };

    this.eventsService.updateEvent(this.eventId, updated).subscribe({
      next: () => {
        alert('Event updated successfully!');
        this.router.navigate(['/admin/manage-events']);
      },
      error: () => alert('Failed to update event. Please try again.')
    });
  }
}
