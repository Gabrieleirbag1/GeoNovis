import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindFlag } from './find-flag.component';

describe('FindFlag', () => {
  let component: FindFlag;
  let fixture: ComponentFixture<FindFlag>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindFlag]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindFlag);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
