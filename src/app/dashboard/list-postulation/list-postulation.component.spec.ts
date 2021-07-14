import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPostulationComponent } from './list-postulation.component';

describe('ListPostulationComponent', () => {
  let component: ListPostulationComponent;
  let fixture: ComponentFixture<ListPostulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPostulationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPostulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
