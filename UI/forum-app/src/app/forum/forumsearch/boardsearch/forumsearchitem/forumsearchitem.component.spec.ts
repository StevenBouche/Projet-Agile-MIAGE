import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumsearchitemComponent } from './forumsearchitem.component';

describe('ForumsearchitemComponent', () => {
  let component: ForumsearchitemComponent;
  let fixture: ComponentFixture<ForumsearchitemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForumsearchitemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumsearchitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
