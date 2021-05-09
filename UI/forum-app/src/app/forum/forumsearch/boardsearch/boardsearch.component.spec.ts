import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardsearchComponent } from './boardsearch.component';

describe('BoardsearchComponent', () => {
  let component: BoardsearchComponent;
  let fixture: ComponentFixture<BoardsearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardsearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardsearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
