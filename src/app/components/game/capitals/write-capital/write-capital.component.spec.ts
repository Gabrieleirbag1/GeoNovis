import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteCapitalComponent } from './write-capital.component';

describe('WriteCapitalComponent', () => {
  let component: WriteCapitalComponent;
  let fixture: ComponentFixture<WriteCapitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WriteCapitalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WriteCapitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
