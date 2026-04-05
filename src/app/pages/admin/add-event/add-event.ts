import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EventsService } from '../../../services/events-service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-event',
  imports: [ReactiveFormsModule],
  templateUrl: './add-event.html',
  styleUrl: './add-event.scss',
})
export class AddEvent {

private eventsService = inject(EventsService);
private router = inject(Router);


addEventForm = new FormGroup({
  title: new FormControl('', Validators.required),
  date: new FormControl('', Validators.required),
  location: new FormControl('', Validators.required),
  description: new FormControl('', Validators.required),
  imageUrl: new FormControl(''),
  driveUrl: new FormControl('')
});

  get title() {
    return this.addEventForm.get('title');
  }
  get date() {
    return this.addEventForm.get('date');
  }
  get location() {
    return this.addEventForm.get('location');
  }
  get description() {
    return this.addEventForm.get('description');
  }
  get imageUrl() {
    return this.addEventForm.get('imageUrl');
  }

onSubmit() {
  if (this.addEventForm.valid) {
    const formValue = this.addEventForm.value;
    const newEvent = {
      title: formValue.title!,
      eventDate: formValue.date!,
      location: formValue.location!,
      description: formValue.description!,
      imageUrl: formValue.imageUrl || '',
      driveUrl: formValue.driveUrl || ''
    };

    this.eventsService.postEvent(newEvent).subscribe({
      next: () => {
        alert('Event created successfully!');
        this.addEventForm.reset();
        this.router.navigate(['/admin']);
      },
      error: () => alert('Failed to create event. Please try again.')
    });
  }
}
 


}
