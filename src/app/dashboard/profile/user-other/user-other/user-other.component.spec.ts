import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOtherComponent } from './user-other.component';

describe('UserOtherComponent', () => {
  let component: UserOtherComponent;
  let fixture: ComponentFixture<UserOtherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserOtherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserOtherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
