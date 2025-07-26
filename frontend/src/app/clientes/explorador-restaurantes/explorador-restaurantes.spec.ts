import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploradorRestaurantes } from './explorador-restaurantes';

describe('ExploradorRestaurantes', () => {
  let component: ExploradorRestaurantes;
  let fixture: ComponentFixture<ExploradorRestaurantes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExploradorRestaurantes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExploradorRestaurantes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
