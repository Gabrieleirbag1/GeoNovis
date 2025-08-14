import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindCountryByFlagComponent } from './find-country-by-flag.component';

describe('FindCountryByFlagComponent', () => {
  let component: FindCountryByFlagComponent;
  let fixture: ComponentFixture<FindCountryByFlagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindCountryByFlagComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FindCountryByFlagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
