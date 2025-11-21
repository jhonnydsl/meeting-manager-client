import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-create-edit-meeting',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './create-edit-meeting.component.html',
  styleUrl: './create-edit-meeting.component.css',
})
export class CreateEditMeetingComponent {
  form: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateEditMeetingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = !!data;

    const brToIso = (value: string) => {
      if (!value) return '';
      const [date, time] = value.split(' ');
      const [day, month, year] = date.split('/');
      return `${year}-${month}-${day}T${time}`;
    };

    this.form = this.fb.group({
      title: [data?.title || '', Validators.required],
      description: [data?.description || '', Validators.required],
      startDate: [brToIso(data?.start_time) || '', Validators.required],
      endDate: [brToIso(data?.end_time) || '', Validators.required],
      status: [data?.status || 'agendada', Validators.required],
    });
  }

  save() {
    if (this.form.invalid) return;

    const result = {
      ...this.form.value,
      startDate: this.form.value.startDate,
      endDate: this.form.value.endDate,
    };

    this.dialogRef.close(result);
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
