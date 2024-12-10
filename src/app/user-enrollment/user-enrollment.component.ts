import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CourseService } from '../services/courseServices.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-enrollment',
  templateUrl: './user-enrollment.component.html',
  styleUrl: './user-enrollment.component.css'
})
export class UserEnrollmentComponent {
  enrollmentList: any[] = [];
  filteredEnrollmentList: any[] = [];
  allCourses: any[] = [];
  enrollmentForm!: FormGroup;

  courseId: number = 0;
  receivedData: any;
  loginUserId: number = 0;
  loginUser: number = 0;
  idDict: any;

  constructor(private service: CourseService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.getCourses();
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

    if (this.loginUser !== 2) {
      this.router.navigate(['']);
    }
    this.loadInitialData();

  }

  deleteEnrollment(enrollmentId: number) {
    this.service.deleteEnrollment(enrollmentId).subscribe(() => {
      this.enrollmentList = this.enrollmentList.filter(enrollment => enrollment.id !== enrollmentId);
      this.filteredEnrollmentList = this.filteredEnrollmentList.filter(enrollment => enrollment.id !== enrollmentId);
    });
  }


  loadInitialData() {
    this.service.userEnrollment(this.loginUserId).subscribe((data) => {
      this.enrollmentList = data;
      console.log('Enrollment List:', this.enrollmentList);
    });

    
  }

  getCourses() {
    this.service.getCourses().subscribe((data) => {
      this.allCourses = data;
      console.log('Courses:', this.allCourses);
    });
  }
  

  goBack() {
    this.idDict = { loginUserId: this.loginUserId, courseId: this.courseId, loginUser: this.loginUser };
    const encodedData = encodeURIComponent(JSON.stringify(this.idDict));
    this.router.navigate(['usercourseview'], { queryParams: { data: encodedData } });
  }
}
