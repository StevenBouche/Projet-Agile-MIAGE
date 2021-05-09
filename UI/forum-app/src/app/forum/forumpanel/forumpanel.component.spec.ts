import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumpanelComponent } from './forumpanel.component';

describe('ForumpanelComponent', () => {
  let component: ForumpanelComponent;
  let fixture: ComponentFixture<ForumpanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForumpanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumpanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
