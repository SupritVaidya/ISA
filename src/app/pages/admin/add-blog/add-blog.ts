import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-blog',
  imports: [ReactiveFormsModule],
  templateUrl: './add-blog.html',
  styleUrl: './add-blog.scss',
})
export class AddBlog {

addBlogForm = new FormGroup({
  title: new FormControl('', Validators.required),
  author: new FormControl('', Validators.required),
  date: new FormControl('', Validators.required),
  excerpt: new FormControl('', Validators.required),
  imageUrl: new FormControl('')
});

  get title() {
    return this.addBlogForm.get('title');
  }
  get author() {
    return this.addBlogForm.get('author');
  }
  get date() {
    return this.addBlogForm.get('date');
  }
  get excerpt() {
    return this.addBlogForm.get('excerpt');
  }
  get imageUrl() {
    return this.addBlogForm.get('imageUrl');
  }
  
  onSubmit() {
    if (this.addBlogForm.valid) {
      const newBlog = this.addBlogForm.value;
      console.log('New Blog:', newBlog);
      // Here you can add logic to save the blog, e.g., call a service to send it to a backend
      } 
    else {
      console.log('Form is invalid');
    } 
  }


}
