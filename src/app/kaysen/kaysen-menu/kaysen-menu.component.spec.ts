import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KaysenMenuComponent } from './kaysen-menu.component';

describe('KaysenMenuComponent', () => {
  let component: KaysenMenuComponent;
  let fixture: ComponentFixture<KaysenMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KaysenMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KaysenMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
