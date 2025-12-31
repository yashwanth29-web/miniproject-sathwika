import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Alluserpayments } from './alluserpayments';

describe('Alluserpayments', () => {
  let component: Alluserpayments;
  let fixture: ComponentFixture<Alluserpayments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Alluserpayments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Alluserpayments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
