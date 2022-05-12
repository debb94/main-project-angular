import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosEmpresasComponent } from './usuarios-empresas.component';

describe('UsuariosEmpresasComponent', () => {
  let component: UsuariosEmpresasComponent;
  let fixture: ComponentFixture<UsuariosEmpresasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuariosEmpresasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuariosEmpresasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
