import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuDia } from './menu-dia';

describe('MenuDia', () => {
  let component: MenuDia;
  let fixture: ComponentFixture<MenuDia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuDia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuDia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
