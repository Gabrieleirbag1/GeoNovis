import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecodeComponent } from './decode.component';

describe('DecodeComponent', () => {
  let component: DecodeComponent;
  let fixture: ComponentFixture<DecodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DecodeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DecodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
