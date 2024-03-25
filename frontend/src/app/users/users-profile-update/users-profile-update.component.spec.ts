import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersProfileUpdateComponent } from './users-profile-update.component';

describe('UsersProfileUpdateComponent', () => {
  let component: UsersProfileUpdateComponent;
  let fixture: ComponentFixture<UsersProfileUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersProfileUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersProfileUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
