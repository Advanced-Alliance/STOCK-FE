import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AnswerCardComponent } from './answer-card.component';

describe('AnswerCardComponent', () => {
  let component: AnswerCardComponent;
  let fixture: ComponentFixture<AnswerCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AnswerCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswerCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
