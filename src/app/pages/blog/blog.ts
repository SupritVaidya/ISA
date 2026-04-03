import { Component, inject, OnInit } from '@angular/core';
import { BlogService } from '../../services/blog-service';

@Component({
  selector: 'app-blog',
  imports: [],
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
})
export class Blog implements OnInit {

  blogService = inject(BlogService);
    blogPosts = this.blogService.blogPosts;
  ngOnInit() {
    this.blogService.loadBlogPosts();
  }


}
