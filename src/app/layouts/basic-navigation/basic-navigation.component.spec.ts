import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicNavigationComponent } from './basic-navigation.component';

describe('BasicNavigationComponent', () => {
  let component: BasicNavigationComponent;
  let fixture: ComponentFixture<BasicNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BasicNavigationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BasicNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
