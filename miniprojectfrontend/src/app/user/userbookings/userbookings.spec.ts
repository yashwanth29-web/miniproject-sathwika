import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Userbookings } from './userbookings';

describe('Userbookings', () => {
  let component: Userbookings;
  let fixture: ComponentFixture<Userbookings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Userbookings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Userbookings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
