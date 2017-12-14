import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpperCardComponent } from './upper-card.component';

describe('UpperCardComponent', () => {
  let component: UpperCardComponent;
  let fixture: ComponentFixture<UpperCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpperCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpperCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
