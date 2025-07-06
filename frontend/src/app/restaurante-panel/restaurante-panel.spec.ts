import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantePanel } from './restaurante-panel';

describe('RestaurantePanel', () => {
  let component: RestaurantePanel;
  let fixture: ComponentFixture<RestaurantePanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantePanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantePanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
