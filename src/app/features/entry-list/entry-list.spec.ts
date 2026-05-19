import { EntryList } from './../entry-list/entry-list';
import { ComponentFixture, TestBed } from '@angular/core/testing';


describe('Entries', () => {
  let component: EntryList;
  let fixture: ComponentFixture<EntryList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntryList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntryList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
