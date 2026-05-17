import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalPage } from './journal-page';

describe('JournalPage', () => {
  let component: JournalPage;
  let fixture: ComponentFixture<JournalPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JournalPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
