import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoCondominiosComponent } from './pago-condominios.component';

describe('PagoCondominiosComponent', () => {
  let component: PagoCondominiosComponent;
  let fixture: ComponentFixture<PagoCondominiosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagoCondominiosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoCondominiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
