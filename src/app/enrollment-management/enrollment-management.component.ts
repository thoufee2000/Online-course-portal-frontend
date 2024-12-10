import { Component, OnInit } from '@angular/core';
import { CourseService } from '../services/courseServices.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-enrollment-management',
  templateUrl: './enrollment-management.component.html',
  styleUrls: ['./enrollment-management.component.css']
})
export class EnrollmentManagementComponent implements OnInit {
  enrollmentList: any[] = [];
  filteredEnrollmentList: any[] = [];
  allCourses: any[] = [];
  enrollmentForm!: FormGroup;

  courseId: number = 0;
  receivedData: any;
  loginUserId: number = 0;
  loginUser: number = 0;
  enrollmentId: number = 0;
  idDict: any;

  constructor(private service: CourseService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.initializeForm();
    this.getCourses();
    this.loadInitialData();
  }

  deleteEnrollment(enrollmentId: number) {
    this.service.deleteEnrollment(enrollmentId).subscribe(() => {
      this.enrollmentList = this.enrollmentList.filter(enrollment => enrollment.id !== enrollmentId);
      this.filteredEnrollmentList = this.filteredEnrollmentList.filter(enrollment => enrollment.id !== enrollmentId);
    });
  }

  initializeForm() {
    this.enrollmentForm = new FormGroup({
      course: new FormControl(''), // Default value set to an empty string
    });
  }

  loadInitialData() {
    this.service.enrollManagement().subscribe((data) => {
      this.enrollmentList = data;
      console.log('Enrollment List:', this.enrollmentList);
    });

    this.route.queryParams.subscribe(params => {
      const data = params['data'];

      if (data) {
        try {
          this.receivedData = JSON.parse(decodeURIComponent(data));
          console.log('Received Data:', this.receivedData);

          this.courseId = this.receivedData['courseId'];
          this.loginUserId = this.receivedData['loginUserId'];
          this.loginUser = this.receivedData['loginUser'];
        } catch (error) {
          console.error('Failed to parse data:', error);
        }
      }
    });

    if (this.loginUser !== 1) {
      this.router.navigate(['']);
    }

    console.log(this.courseId)
    this.enrollmentForm.setValue({
      course: this.courseId

    })
    this.onCourseChange();
  }

  getCourses() {
    this.service.getCourses().subscribe((data) => {
      this.allCourses = data;
      console.log('Courses:', this.allCourses);
    });
  }

  message: string = '';
  onCourseChange() {
    const courseId = this.enrollmentForm.get('course')?.value;
    this.message = ''

    if (!courseId) {
      this.courseId = 0;
      // Restore the original enrollment list if no course is selected
      this.filteredEnrollmentList = [];
      return;
      
    }
    this.courseId = courseId
    console.log('Selected Course ID:', courseId);
    this.service.courseFilter(courseId).subscribe((data) => {
      this.filteredEnrollmentList = data;
      console.log('Filtered Enrollment List:', this.filteredEnrollmentList);
      this.message = data.message
      console.log(this.message);
      // console.log('Filtered Enrollment List:', this.filteredEnrollmentList);
    });
  }

  updateEnrollment(id: number) {
    this.enrollmentId = id;
    this.idDict = { loginUserId: this.loginUserId, courseId: this.courseId, loginUser: this.loginUser, enrollmentId: this.enrollmentId };
    const encodedData = encodeURIComponent(JSON.stringify(this.idDict));
    this.router.navigate(['updateenrollment'], { queryParams: { data: encodedData } });

  }


  goBack() {
    this.idDict = { loginUserId: this.loginUserId, courseId: this.courseId, loginUser: this.loginUser };
    const encodedData = encodeURIComponent(JSON.stringify(this.idDict));
    this.router.navigate(['viewcourses'], { queryParams: { data: encodedData } });
  }
}
