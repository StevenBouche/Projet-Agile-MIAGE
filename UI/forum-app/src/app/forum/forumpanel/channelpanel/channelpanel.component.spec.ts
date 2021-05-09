import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelpanelComponent } from './channelpanel.component';

describe('ChannelpannelComponent', () => {
  let component: ChannelpanelComponent;
  let fixture: ComponentFixture<ChannelpanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelpanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelpanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
