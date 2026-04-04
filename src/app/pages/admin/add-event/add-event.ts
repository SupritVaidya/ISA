import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-event',
  imports: [ReactiveFormsModule],
  templateUrl: './add-event.html',
  styleUrl: './add-event.scss',
})
export class AddEvent {
addEventForm = new FormGroup({
  title: new FormControl('', Validators.required),
  date: new FormControl('', Validators.required),
  location: new FormControl('', Validators.required),
  description: new FormControl('', Validators.required),
  imageUrl: new FormControl('')
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
      const newEvent = this.addEventForm.value;
      console.log('New Event:', newEvent);
      // Here you can add logic to save the event, e.g., call a service to send it to a backend
    } 
    else {
      console.log('Form is invalid');
    }
  } 


}
