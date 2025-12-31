import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Admintowers } from './admintowers';

describe('Admintowers', () => {
  let component: Admintowers;
  let fixture: ComponentFixture<Admintowers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Admintowers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Admintowers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
