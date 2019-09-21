import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivatComponent } from './privat.component';

describe('PrivatComponent', () => {
  let component: PrivatComponent;
  let fixture: ComponentFixture<PrivatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
