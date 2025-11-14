import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MeetingsService } from '../../services/meetings/meetings.service';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { CreateEditMeetingComponent } from '../create-edit-meeting/create-edit-meeting.component';
import { DeleteConfirmComponent } from '../delete-confirm/delete-confirm.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    CreateEditMeetingComponent,
    DeleteConfirmComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  sidebarOpen = false;
  meetings: any[] = [];
  loading = false;

  @ViewChild('startDialog') startDialogTpl!: TemplateRef<any>;

  constructor(
    private meetingService: MeetingsService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadMeetings();
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  loadMeetings() {
    this.loading = true;
    this.meetingService.getMeetings().subscribe({
      next: (res) => {
        this.meetings = Array.isArray(res) ? res : [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar reuniões:', err);
        this.loading = false;
        alert('Erro ao carregar reuniões. Veja console.');
      },
    });
  }

  openCreateMeeting() {
    const ref = this.dialog.open(CreateEditMeetingComponent, {
      width: '520px',
      data: null,
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        const payload = {
          title: result.title,
          description: result.description,
          start_time: result.startDate,
          end_time: result.endDate,
        };
        this.meetingService.createMeeting(payload).subscribe({
          next: () => this.loadMeetings(),
          error: (err) => {
            console.error('Erro ao criar reunião:', err);
            alert('Erro ao criar reunião. Veja o console.');
          },
        });
      }
    });
  }

  openEditMeeting(meeting: any) {
    const ref = this.dialog.open(CreateEditMeetingComponent, {
      width: '520px',
      data: {
        // passe os campos que seu modal espera
        title: meeting.title,
        description: meeting.description,
        startDate: meeting.startDate,
        endDate: meeting.endDate,
      },
    });
  }

  openDeleteDialog(meeting: any) {
    const ref = this.dialog.open(DeleteConfirmComponent, {
      width: '380px',
      data: { title: meeting.title },
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.meetingService.deleteMeeting(meeting.id).subscribe({
          next: () => this.loadMeetings(),
          error: (err) => {
            console.error('Erro ao deletar reunião:', err);
            alert('Erro ao deletar reunião. Veja console.');
          },
        });
      }
    });
  }

  onLogout() {
    console.log('logout');
  }

  startMeeting(meeting: any) {
    this.dialog.open(this.startDialogTpl, {
      width: '420px',
      data: { meeting },
    });
  }

  trackByMeeting(index: number, item: any) {
    return item?.id ?? index;
  }
}
