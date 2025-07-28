import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroHostsComponent } from './cadastro-hosts.component';

describe('CadastroHostsComponent', () => {
  let component: CadastroHostsComponent;
  let fixture: ComponentFixture<CadastroHostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CadastroHostsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroHostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
