import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindCountryByCapitalComponent } from './find-country-by-capital.component';

describe('FindCountryByCapitalComponent', () => {
  let component: FindCountryByCapitalComponent;
  let fixture: ComponentFixture<FindCountryByCapitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindCountryByCapitalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FindCountryByCapitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
