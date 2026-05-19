import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitModal } from './exit-modal';

describe('ExitModal', () => {
  let component: ExitModal;
  let fixture: ComponentFixture<ExitModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExitModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExitModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
