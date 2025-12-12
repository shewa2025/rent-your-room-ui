import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicListingComponent } from './public-listing.component';

describe('PublicListingComponent', () => {
  let component: PublicListingComponent;
  let fixture: ComponentFixture<PublicListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicListingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
