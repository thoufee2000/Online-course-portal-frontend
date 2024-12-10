import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { CourseService } from '../services/courseServices.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent implements OnInit {
  registrationForm!: FormGroup;
  states: any[] = [];
  cities: any[] = [];
  gender = [{ 'id': 1, 'value': 'Male' }, { 'id': 2, 'value': 'Female' }, { 'id': 3, 'value': 'Other' }]
  courseId: number = 0;
  currentState!: string;
  currentCities: any[] = [];
  
  receivedData: any;
  loginUserId: number = 0;
  loginUser: number = 0;
  idDict: any

  message: any;

  constructor(private service: CourseService,private route:ActivatedRoute,private router:Router) { }

  ngOnInit() {
    this.initializeForm();
    this.loadInitialData();
  }

  loadInitialData() {
    this.service.getStates().subscribe(data => {
      this.states = data;
      console.log(this.states);
    })
    this.service.getCities().subscribe(data => {
      this.cities = data;
      console.log(this.cities);
    })

    this.route.queryParams.subscribe(params => {
      const data = params['data'];

      if (data) {
        try {
          this.receivedData = JSON.parse(decodeURIComponent(data));
          console.log(this.receivedData);

          this.courseId = this.receivedData['courseId'];
          this.loginUserId = this.receivedData['loginUserID']
          this.loginUser = this.receivedData['loginUserType']
          
        } catch (error) {
          console.error('Failed to parse data:', error);
        }
      }
    });
    
  }

  initializeForm() {
    this.registrationForm = new FormGroup({
      // Personal Details Section
      fullName: new FormControl(null, [Validators.required,this.noNumbersAllowed]),
      email: new FormControl(null, [Validators.required, Validators.email, this.customEmailValidator]),
      password: new FormControl(null, [Validators.required, this.passwordValidator]),
      confirmPassword: new FormControl(null, [Validators.required]),
      phoneNumber: new FormControl(null, [Validators.required, this.phoneNumberValidator]),
      state: new FormControl(null, [Validators.required]),      city: new FormControl(null, [Validators.required]),
      dateOfBirth: new FormControl(null, [this.minimumAgeValidator(18)]),
      gender: new FormControl(null, [Validators.required]),
      profilePicture: new FormControl(''),
      termsAndConditions: new FormControl(false, [Validators.requiredTrue]),

    })

  }

  getStates() {
    const target = this.registrationForm.get('state')?.value;
    this.registrationForm.get('city')?.reset();
    console.log(target);
    if (target) {
      this.courseId = +target;
      this.currentCities = this.cities.filter(cities => cities.state == this.courseId);
      console.log(this.currentCities);
    }
  }


  minimumAgeValidator(minAge: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // No value, so no validation error
      }

      const birthDate = new Date(control.value);
      const today = new Date();

      const age = today.getFullYear() - birthDate.getFullYear();
      const isOldEnough =
        age > minAge ||
        (age === minAge &&
          (today.getMonth() > birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() &&
              today.getDate() >= birthDate.getDate())));

      return isOldEnough ? null : { minimumAge: { requiredAge: minAge } };
    };
  }

  noSpacesAndNumbersAllowed(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value || value.includes(' ') || /[0-9]/.test(value)) {
      return { noSpacesAndNumbers: true };
    }
    return null;
  }

  noNumbersAllowed(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value && value.trimStart().length !== value.length || !value || /[0-9]/.test(value)) {
      return { whiteSpaceAtStartAndNumbers: true };
    }
    return null;
  }

  customEmailValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; // No value, no error (handled by required validator if applied)
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailRegex.test(control.value);

    return isValid ? null : { invalidEmail: true };
  }

  phoneNumberValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; // No value, no error (handled by required validator if applied)
    }

    const phoneRegex = /^\d{10}$/; // Ensures exactly 10 digits
    const isValid = phoneRegex.test(control.value);

    return isValid ? null : { invalidPhoneNumber: true };
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; // No value, no error (handled by required validator if applied)
    }

    // Regular expression to check password criteria
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const isValid = passwordRegex.test(control.value);

    return isValid ? null : { invalidPassword: true };
  }

  passwordMatchValidator(passwordField: string, confirmPasswordField: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get(passwordField)?.value;
      const confirmPassword = formGroup.get(confirmPasswordField)?.value;

      if (password !== confirmPassword) {
        formGroup.get(confirmPasswordField)?.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        formGroup.get(confirmPasswordField)?.setErrors(null);
        return null;
      }
    };
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.registrationForm.patchValue({
        profilePicture: file,
      });
      console.log(this.registrationForm.get('profilePicture')?.value);
      this.registrationForm.get('profilePicture')?.updateValueAndValidity();
    }
  }


  onSubmit() {
    this.registrationForm.markAllAsTouched();
    if (this.registrationForm.valid) {
      const formData = new FormData();
      Object.keys(this.registrationForm.controls).forEach(key => {
        if (key === 'profilePicture' && this.registrationForm.get(key)?.value instanceof File) {
          formData.append(key, this.registrationForm.get(key)?.value);
        } else {
          formData.append(key, this.registrationForm.get(key)?.value || '');
        }
      });

      this.service.createUser(formData).subscribe(
        data => {
          this.message = data;
          console.log(this.message);
          this.resetForm();
          this.router.navigate(['']);
        },
        error => {
          console.error('Error during form submission:', error);
        }
      );
    } else {
      console.log('Form invalid');
      console.log(this.registrationForm.value);
    }
  }

  resetForm(){
    this.registrationForm.reset();
  }

  goToLogin(){
    this.idDict = { 'loginUserId': this.loginUserId, 'courseId': this.courseId, 'loginUser': this.loginUser };
    const encodedData = encodeURIComponent(JSON.stringify(this.idDict));
    this.router.navigate([''], { queryParams: { data: encodedData } });
  }
}
