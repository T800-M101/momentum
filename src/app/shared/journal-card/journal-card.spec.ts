import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalCard } from './journal-card';

describe('JournalCard', () => {
  let component: JournalCard;
  let fixture: ComponentFixture<JournalCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JournalCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
