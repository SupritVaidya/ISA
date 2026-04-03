import { Injectable, signal } from '@angular/core';

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  imageUrl: string;
  linkedIn: string;
  instagram: string;
}


@Injectable({
  providedIn: 'root',
})
export class TeamService {
  teamMembers = signal<TeamMember[]>([]);

  loadTeamMembers(){
    this.teamMembers.set([
      {
        id: 1,
        name: "John Doe",
        role: "President",
        imageUrl: "https://placehold.co/300x300",
        linkedIn: "https://linkedin.com/in/johndoe",
        instagram: "https://instagram.com/johndoe"
      },
      {
        id: 2,
        name: "Jane Smith",
        role: "Vice President",
        imageUrl: "https://placehold.co/300x300",
        linkedIn: "https://linkedin.com/in/janesmith",
        instagram: "https://instagram.com/janesmith"
      },
      {
        id: 3,
        name: "Emily Johnson",
        role: "Marketing Director",
        imageUrl: "https://placehold.co/300x300",
        linkedIn: "https://linkedin.com/in/emilyjohnson",
        instagram: "https://instagram.com/emilyjohnson"
      },
      {
        id: 4,
        name: "Michael Brown",
        role: "Sales Manager",
        imageUrl: "https://placehold.co/300x300",
        linkedIn: "https://linkedin.com/in/michaelbrown",
        instagram: "https://instagram.com/michaelbrown"
      }

    ]);
  }

}
