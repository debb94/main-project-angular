import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KaysenComponent } from './kaysen.component';

describe('KaysenComponent', () => {
  let component: KaysenComponent;
  let fixture: ComponentFixture<KaysenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KaysenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KaysenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
