import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscComponent } from './insc.component';

describe('InscComponent', () => {
  let component: InscComponent;
  let fixture: ComponentFixture<InscComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InscComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InscComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
