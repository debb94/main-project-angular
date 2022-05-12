import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HandlerAppComponent } from './handler-app.component';

describe('HandlerAppComponent', () => {
  let component: HandlerAppComponent;
  let fixture: ComponentFixture<HandlerAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HandlerAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HandlerAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
