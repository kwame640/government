import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Signp } from './signp';

describe('Signp', () => {
  let component: Signp;
  let fixture: ComponentFixture<Signp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Signp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Signp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
