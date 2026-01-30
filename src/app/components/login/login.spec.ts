import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login'; // התיקון: שינינו ל-LoginComponent

describe('LoginComponent', () => {
  let component: LoginComponent; // התיקון: שינינו ל-LoginComponent
  let fixture: ComponentFixture<LoginComponent>; // התיקון: שינינו ל-LoginComponent

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent] // התיקון: שינינו ל-LoginComponent
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginComponent); // התיקון: שינינו ל-LoginComponent
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});