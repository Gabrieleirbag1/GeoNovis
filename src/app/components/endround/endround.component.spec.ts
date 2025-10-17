import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndroundComponent } from './endround.component';

describe('EndroundComponent', () => {
  let component: EndroundComponent;
  let fixture: ComponentFixture<EndroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EndroundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EndroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
