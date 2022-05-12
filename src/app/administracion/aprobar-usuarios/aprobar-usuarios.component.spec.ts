import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AprobarUsuariosComponent } from './aprobar-usuarios.component';

describe('AprobarUsuariosComponent', () => {
  let component: AprobarUsuariosComponent;
  let fixture: ComponentFixture<AprobarUsuariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AprobarUsuariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AprobarUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
