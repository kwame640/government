import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Executive } from './executive';

describe('Executive', () => {
  let component: Executive;
  let fixture: ComponentFixture<Executive>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Executive]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Executive);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
