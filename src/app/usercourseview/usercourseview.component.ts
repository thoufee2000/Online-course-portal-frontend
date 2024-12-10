import { Component, OnInit } from '@angular/core';
import { CourseService } from '../services/courseServices.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-usercourseview',
  templateUrl: './usercourseview.component.html',
  styleUrl: './usercourseview.component.css'
})
export class UsercourseviewComponent implements OnInit {
  searchForm!: FormGroup;
  categoryFilterForm!: FormGroup;
  allCourses: any[] = [];
  allCategories: any[] = [];
  filteredCourses: any[] = [];
  search: boolean = false;
  lastSearchTerm: string = '';
  
  receivedData: any;
  courseId: number = 0;
  loginUserId: number = 0;
  loginUser: number = 0;
  idDict: any;
  
  constructor(private service: CourseService, private route: Router,private router:ActivatedRoute) { }

  ngOnInit(): void {
    this.initializeSearchForm();
    this.initializeCategoryFilterForm();
    this.service.getCourses().subscribe({
      next: (data) => {
        this.allCourses = data;
        this.filteredCourses = [...this.allCourses];
      },
      error: (error) => {
        console.error('Error fetching courses:', error);
      }
    });
    this.service.getCategories().subscribe({
      next: (data) => {
        this.allCategories = data;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
    
    setTimeout(() => {
      this.filterByCategory('all');
    }, 300);

    this.router.queryParams.subscribe(params => {
      const data = params['data'];

      if (data) {
        try {
          this.receivedData = JSON.parse(decodeURIComponent(data));
          console.log(this.receivedData);

          this.courseId = this.receivedData['courseId'];
          this.loginUserId = this.receivedData['loginUserId']
          this.loginUser = this.receivedData['loginUser']

          console.log(this.loginUserId);
          console.log(this.loginUser);
          
        } catch (error) {
          console.error('Failed to parse data:', error);
        }
      }
    });
    if(this.loginUser!=2){
      this.route.navigate(['']);
    }
  }

  initializeSearchForm() {
    this.searchForm = new FormGroup({
      searchTerm: new FormControl('')
    });
  }

  initializeCategoryFilterForm() {
    this.categoryFilterForm = new FormGroup({
      category: new FormControl(false),
      categoryAll: new FormControl(true)
    });
  }

  selectedCategories: string[] = [];

  filterByCategory(category: string) {
    
    // Clear search term when filtering by category
    this.searchForm.get('searchTerm')?.setValue('');
    this.lastSearchTerm = '';

    if (category === 'all') {
      // Clear all selected categories if "All" is selected
      this.categoryFilterForm.get('category')?.setValue(false);
      this.selectedCategories = [];
      this.filteredCourses = [...this.allCourses];
      this.categoryFilterForm.get('categoryAll')?.setValue(true);
    } else {
      this.categoryFilterForm.get('categoryAll')?.setValue(false);
      const index = this.selectedCategories.indexOf(category);
  
      if (index === -1) {
        this.selectedCategories.push(category);
        
      } else {
        this.selectedCategories.splice(index, 1);
        this.categoryFilterForm.get('categoryAll')?.setValue(true);
      }
  
      // If no categories are selected, show all courses
      if (this.selectedCategories.length === 0) {
        this.filteredCourses = [...this.allCourses];
      } else {
        // Filter courses based on selected categories
        this.filteredCourses = this.allCourses.filter((course) =>
          this.selectedCategories.includes(course.category)
        );
      }
    }

    // If there was a previous search, apply it to the filtered results
    if (this.lastSearchTerm) {
      this.filteredCourses = this.filteredCourses.filter((course) =>
        course.courseTitle.toLowerCase().includes(this.lastSearchTerm)
      );
    }
  }
  

  searchCourses() {
    // Clear all selected categories when searching
    this.selectedCategories = [];

    const searchTerm = this.searchForm.get('searchTerm')?.value.toLowerCase();
    this.lastSearchTerm = searchTerm;

    // Always search from the full course list
    this.filteredCourses = this.allCourses.filter((course) =>
      course.courseTitle.toLowerCase().includes(searchTerm)
    );

    this.searchForm.reset();
    this.categoryFilterForm.reset();
  }

  viewCourse(id: number) {
      this.courseId = id;
      this.idDict = { 'loginUserId': this.loginUserId, 'courseId': this.courseId,  'loginUser': this.loginUser };
      const encodedData = encodeURIComponent(JSON.stringify(this.idDict));
      this.route.navigate(['singlecourse'], { queryParams: { data: encodedData } });
  }

  getImageUrl(url: string): string {
    if (url && !url.startsWith('http')) {
      return `http://127.0.0.1:8000/${url}`;
    }
    return url || 'assets/default-course-image.jpg';
  }

  handleImageError(event: any) {
    console.error('Image load failed:', event.target.src);
  }

  logout(){
    this.route.navigate(['']);
  }

  enrollmentList(){
    this.idDict = { loginUserId: this.loginUserId, courseId: this.courseId, loginUser: this.loginUser };
    const encodedData = encodeURIComponent(JSON.stringify(this.idDict));
    this.route.navigate(['userenrollment'], { queryParams: { data: encodedData } });
  }
}