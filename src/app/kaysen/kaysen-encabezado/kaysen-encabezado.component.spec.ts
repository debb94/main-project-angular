import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KaysenEncabezadoComponent } from './kaysen-encabezado.component';

describe('KaysenEncabezadoComponent', () => {
  let component: KaysenEncabezadoComponent;
  let fixture: ComponentFixture<KaysenEncabezadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KaysenEncabezadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KaysenEncabezadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
