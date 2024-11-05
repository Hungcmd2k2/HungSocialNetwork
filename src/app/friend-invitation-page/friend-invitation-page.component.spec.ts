import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendInvitationPageComponent } from './friend-invitation-page.component';

describe('FriendInvitationPageComponent', () => {
  let component: FriendInvitationPageComponent;
  let fixture: ComponentFixture<FriendInvitationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FriendInvitationPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FriendInvitationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
