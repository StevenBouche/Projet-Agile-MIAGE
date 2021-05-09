import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumsearchComponent } from './forumsearch.component';

describe('ForumsearchComponent', () => {
  let component: ForumsearchComponent;
  let fixture: ComponentFixture<ForumsearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForumsearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumsearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
