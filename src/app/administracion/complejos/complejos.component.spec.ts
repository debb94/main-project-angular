import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplejosComponent } from './complejos.component';

describe('ComplejosComponent', () => {
  let component: ComplejosComponent;
  let fixture: ComponentFixture<ComplejosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplejosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplejosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
