import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Adminbookings } from './adminbookings';

describe('Adminbookings', () => {
  let component: Adminbookings;
  let fixture: ComponentFixture<Adminbookings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Adminbookings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Adminbookings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
