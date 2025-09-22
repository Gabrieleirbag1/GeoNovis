import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindCountryByLicensePlate } from './find-country-by-license-plate.component';

describe('FindCountryByLicensePlate', () => {
  let component: FindCountryByLicensePlate;
  let fixture: ComponentFixture<FindCountryByLicensePlate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindCountryByLicensePlate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindCountryByLicensePlate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
