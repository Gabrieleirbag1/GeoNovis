import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindLicensePlate } from './find-license-plate.component';

describe('FindLicensePlate', () => {
  let component: FindLicensePlate;
  let fixture: ComponentFixture<FindLicensePlate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindLicensePlate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindLicensePlate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
