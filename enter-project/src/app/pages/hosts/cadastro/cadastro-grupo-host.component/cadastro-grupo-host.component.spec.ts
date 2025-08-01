import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroGrupoHostComponent } from './cadastro-grupo-host.component';

describe('CadastroGrupoHostComponent', () => {
  let component: CadastroGrupoHostComponent;
  let fixture: ComponentFixture<CadastroGrupoHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CadastroGrupoHostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroGrupoHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
