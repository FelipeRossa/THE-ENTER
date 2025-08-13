import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VincularHostGrupoComponent } from './vincular-host-grupo.component';

describe('VincularHostGrupoComponent', () => {
  let component: VincularHostGrupoComponent;
  let fixture: ComponentFixture<VincularHostGrupoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VincularHostGrupoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VincularHostGrupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
