import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticiaAdminPlistPage } from './plist';

describe('NoticiaAdminPlistPage', () => {
  let component: NoticiaAdminPlistPage;
  let fixture: ComponentFixture<NoticiaAdminPlistPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticiaAdminPlistPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticiaAdminPlistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
