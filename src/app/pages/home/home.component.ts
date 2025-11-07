import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MeetingsService } from '../../services/meetings/meetings.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  sidebarOpen = false;
  meetings: any[] = [];

  constructor(private meetingService: MeetingsService) {}

  ngOnInit() {
    this.loadMeetings();
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  loadMeetings() {
    this.meetingService.getMeetings().subscribe({
      next: (res) => {
        this.meetings = res;
      },
      error: (err) => {
        console.error('Erro ao buscar reuniões:', err);
      },
    });
  }
}
