import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuRestaurante } from './menu-restaurante';

describe('MenuRestaurante', () => {
  let component: MenuRestaurante;
  let fixture: ComponentFixture<MenuRestaurante>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuRestaurante]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuRestaurante);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
