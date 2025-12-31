import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Userpayments } from './userpayments';

describe('Userpayments', () => {
  let component: Userpayments;
  let fixture: ComponentFixture<Userpayments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Userpayments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Userpayments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
