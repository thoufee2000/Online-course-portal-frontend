import { Component, OnInit } from '@angular/core';
import { CourseService } from '../services/courseServices.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-course-view',
  templateUrl: './course-view.component.html',
  styleUrl: './course-view.component.css'
})
export class CourseViewComponent implements OnInit {
  courseForm!:FormGroup;
  searchForm!:FormGroup;
  allCourses: any[] = [];
  allCategories: any[] = [];
  selectedCategories: any[] = [];
  lastSearchTerm: string = '';
  filteredCourses: any[] = [];

  receivedData: any;
  loginUserId: number = 0;
  loginUser: number = 0;
  courseId: number = 0;
  idDict: any;
  noResult:boolean=false;

  constructor(private service: CourseService,private route:Router,private router:ActivatedRoute) {}

  ngOnInit() {
    this.initializeSearchForm();
    this.service.getCourses().subscribe({
      next: (data) => {
        this.filteredCourses = data;
        console.log(this.allCourses);
      },
      error: (error) => {
        console.error('Error fetching courses:', error);
      }
    });
    this.router.queryParams.subscribe(params => {
      const data = params['data'];

      this.fetchCourses();

      if (data) {
        try {
          this.receivedData = JSON.parse(decodeURIComponent(data));
          console.log(this.receivedData);

          this.courseId = this.receivedData['courseId'];
          this.loginUserId = this.receivedData['loginUserId']
          this.loginUser = this.receivedData['loginUser']
          
        } catch (error) {
          console.error('Failed to parse data:', error);
        }
      }
    });
    if(this.loginUser!=1){
      this.route.navigate(['']);
    }
    this.noResult=false;
  }

  initializeSearchForm() {
    this.searchForm = new FormGroup({
      searchTerm: new FormControl('')
    });
  }

  getImageUrl(url: string): string {
    // If the URL is relative, prepend the base URL
    if (url && !url.startsWith('http')) {
      return `http://127.0.0.1:8000/${url}`;
    }
    return url || 'assets/default-course-image.jpg';
  }

  handleImageError(event: any) {
    console.error('Image load failed:', event.target.src);
    // event.target.src = 'assets/default-course-image.jpg';
  }


  updateCourse(id: number) {
    this.courseId = id;
    this.idDict = { 'loginUserId': this.loginUserId, 'courseId': this.courseId,  'loginUser': this.loginUser };
      const encodedData = encodeURIComponent(JSON.stringify(this.idDict));
      this.route.navigate(['editcourse'], { queryParams: { data: encodedData } });
  }

  fetchCourses(){
    this.service.getCourses().subscribe({
      next: (data) => {
        this.allCourses = data;
        console.log(this.allCourses);
      },
      error: (error) => {
        console.error('Error fetching courses:', error);
      }
    });
  }

  deleteCourse(id: number) {
    console.log(id)
    const confirmation = confirm('Are you sure you want to enroll this course?');
    if(confirmation){
      this.service.deleteCourse(id).subscribe({
        next: (data) => {
          console.log(data);
          this.fetchCourses();
        },
        error: (error) => {
          console.error('Error deleting course:', error);
        }
      })
    }
    
  }

  addCourse(){
    this.idDict = { 'loginUserId': this.loginUserId, 'courseId': this.courseId,  'loginUser': this.loginUser };
      const encodedData = encodeURIComponent(JSON.stringify(this.idDict));
      this.route.navigate(['addcourses'], { queryParams: { data: encodedData } });
  }

  logout(){
    this.idDict = { 'loginUserId': this.loginUserId, 'courseId': this.courseId,  'loginUser': this.loginUser };
    const encodedData = encodeURIComponent(JSON.stringify(this.idDict));
    this.route.navigate([''], { queryParams: { data: encodedData } });
  }

  enrollList(){
    this.idDict = { 'loginUserId': this.loginUserId, 'courseId': this.courseId,  'loginUser': this.loginUser };
    const encodedData = encodeURIComponent(JSON.stringify(this.idDict));
    this.route.navigate(['enrollmentmanagement'], { queryParams: { data: encodedData } });
  }

  searchCourses() {
    this.selectedCategories = [];

    const searchTerm = this.searchForm.get('searchTerm')?.value.toLowerCase();
    this.lastSearchTerm = searchTerm;

    // Always search from the full course list
    this.filteredCourses = this.allCourses.filter((course) =>
      course.courseTitle.toLowerCase().includes(searchTerm)
    );
    if(this.allCourses.length==0){
      this.noResult=true;
    }else{
      this.noResult=false;
    }

    // this.searchForm.reset();
  }
}