import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosAdministradoresComponent } from './usuarios-administradores.component';

describe('UsuariosAdministradoresComponent', () => {
  let component: UsuariosAdministradoresComponent;
  let fixture: ComponentFixture<UsuariosAdministradoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuariosAdministradoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuariosAdministradoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
