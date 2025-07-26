import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosDia } from './pedidos-dia';

describe('PedidosDia', () => {
  let component: PedidosDia;
  let fixture: ComponentFixture<PedidosDia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PedidosDia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PedidosDia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
