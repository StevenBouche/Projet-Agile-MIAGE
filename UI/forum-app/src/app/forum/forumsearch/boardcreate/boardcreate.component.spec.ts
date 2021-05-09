import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardcreateComponent } from './boardcreate.component';

describe('BoardcreateComponent', () => {
  let component: BoardcreateComponent;
  let fixture: ComponentFixture<BoardcreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardcreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardcreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
