import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindCapital } from './find-capital';

describe('FindCapital', () => {
  let component: FindCapital;
  let fixture: ComponentFixture<FindCapital>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindCapital]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindCapital);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
