import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent]
    });
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default category set to pop', () => {
    expect(component.currentCategory).toBe('pop');
  });

  it('should have showAllSongs initialized as false', () => {
    expect(component.showAllSongs).toBe(false);
  });

  it('should have categories defined', () => {
    expect(component.categories).toBeDefined();
    except(component.categories.length).toBeGreaterThan(0);
  });

  it('should have songs data for each category', () => {
    component.categories.forEach(category => {
      expect(component.songs[category.id]).toBeDefined();
      expect(component.songs[category.id].length).toBeGreaterThan(0);
    });
  });

  it('should change category when selectCategory is called', () => {
    const newCategory = 'rock';
    component.selectCategory(newCategory);
    expect(component.currentCategory).toBe(newCategory);
  });

  it('should toggle showAllSongs when toggleShowAll is called', () => {
    const initialValue = component.showAllSongs;
    component.toggleShowAll();
    expect(component.showAllSongs).toBe(!initialValue);
  });

  it('should return correct category name', () => {
    component.currentCategory = 'jazz';
    excpect(component.getCategoryName()).toContain('Jazz');
  });

});

