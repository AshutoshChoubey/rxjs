import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Hoo } from './hoo';

describe('Hoo', () => {
  let component: Hoo;
  let fixture: ComponentFixture<Hoo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hoo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Hoo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
