import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditMeetingComponent } from './create-edit-meeting.component';

describe('CreateEditMeetingComponent', () => {
  let component: CreateEditMeetingComponent;
  let fixture: ComponentFixture<CreateEditMeetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEditMeetingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateEditMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
