import { Injectable, signal } from '@angular/core';

export interface BlogPost {
  id: number;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  imageUrl: string;
}


@Injectable({
  providedIn: 'root',
})
export class BlogService {

  blogPosts = signal<BlogPost[]>([]);
  loadBlogPosts() {
    this.blogPosts.set([      
      {
      id: 1,
      title: 'Exploring the Rich Culture of India',
      author: 'John Doe',
      date: '2023-10-01',
      excerpt: 'Discover the vibrant traditions, festivals, and art forms that make India a cultural treasure trove.',  
      imageUrl: 'https://placehold.co/600x300'
      },
      {
      id: 2,
      title: 'Top 10 Must-Visit Places in India', 
      author: 'Jane Smith',
      date: '2023-10-15',
      excerpt: 'From the majestic Taj Mahal to the serene backwaters of Kerala, explore the top destinations in India.',  
      imageUrl: 'https://placehold.co/600x300'
      },
      {
      id: 3,
      title: 'Top 10 Must-Eat Food dishes in India', 
      author: 'Shivang Rao',
      date: '2025-10-08',
      excerpt: 'From the delicious kebabs to the flavorful biryanis, explore the top food dishes in India.',  
      imageUrl: 'https://placehold.co/600x300'
      },
      {
      id: 4,
      title: 'A Journey Through the Himalayas',
      author: 'Alice Johnson',
      date: '2023-11-20',
      excerpt: 'Experience the breathtaking beauty and spiritual significance of the majestic Himalayan mountain range.',
      imageUrl: 'https://placehold.co/600x300'
      }
    ]);
  }

  
}
