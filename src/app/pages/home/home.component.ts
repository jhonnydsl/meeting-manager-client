import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MeetingsService } from '../../services/meetings/meetings.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

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
  username: string = '';

  @ViewChild('startDialog') startDialogTpl!: TemplateRef<any>;

  constructor(
    private meetingService: MeetingsService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.loadMeetings();
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  loadUsers() {
    const token = localStorage.getItem('token');

    if (token) {
      const decoded: any = jwtDecode(token);

      this.username = decoded.name || decoded.username;
    }
  }

  loadMeetings() {
    this.loading = true;
    this.meetingService.getMeetings().subscribe({
      next: (res) => {
        this.meetings = Array.isArray(res)
          ? res.map((m) => ({
              ...m,
              startDate: m.start_time ? new Date(m.start_time) : null,
              endDate: m.end_time ? new Date(m.end_time) : null,
            }))
          : [];
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
        const pad = (n: number) => n.toString().padStart(2, '0');
        const formatDateBR = (dateStr: string) => {
          const d = new Date(dateStr);
          return `${pad(d.getDate())}/${pad(
            d.getMonth() + 1
          )}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
        };

        const payload = {
          title: result.title,
          description: result.description,
          start_time: formatDateBR(result.startDate),
          end_time: formatDateBR(result.endDate),
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
        title: meeting.title,
        description: meeting.description,
        startDate: meeting.startDate,
        endDate: meeting.endDate,
      },
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        const pad = (n: number) => n.toString().padStart(2, '0');
        const formatDateBR = (dateStr: string) => {
          const d = new Date(dateStr);
          return `${pad(d.getDate())}/${pad(
            d.getMonth() + 1
          )}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
        };

        const payload = {
          title: result.title,
          description: result.description,
          start_time: formatDateBR(result.startDate),
          end_time: formatDateBR(result.endDate),
        };

        this.meetingService.updateMeeting(meeting.id, payload).subscribe({
          next: () => this.loadMeetings(),
          error: (err) => {
            console.error('Erro ao atualizar reunião:', err);
            alert('Erro ao atualizar reunião. Veja o console.');
          },
        });
      }
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
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
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
