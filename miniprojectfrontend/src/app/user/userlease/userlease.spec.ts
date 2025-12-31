import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Userlease } from './userlease';

describe('Userlease', () => {
  let component: Userlease;
  let fixture: ComponentFixture<Userlease>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Userlease]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Userlease);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
