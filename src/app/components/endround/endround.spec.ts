import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Endround } from './endround';

describe('Endround', () => {
  let component: Endround;
  let fixture: ComponentFixture<Endround>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Endround]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Endround);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
