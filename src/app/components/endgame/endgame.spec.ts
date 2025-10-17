import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Endgame } from './endgame';

describe('Endgame', () => {
  let component: Endgame;
  let fixture: ComponentFixture<Endgame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Endgame]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Endgame);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
