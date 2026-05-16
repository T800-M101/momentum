import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Jump } from './jump';

describe('Jump', () => {
  let component: Jump;
  let fixture: ComponentFixture<Jump>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Jump]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Jump);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
