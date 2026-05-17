import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalEditor } from './journal-editor';

describe('JournalEditor', () => {
  let component: JournalEditor;
  let fixture: ComponentFixture<JournalEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JournalEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
