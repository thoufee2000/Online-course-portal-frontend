import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserFormComponent } from './user-form/user-form.component';
import { HttpClientModule } from '@angular/common/http';
import { CourseComponent } from './course/course.component';
import { CourseViewComponent } from './course-view/course-view.component';
import { EditCourseComponent } from './edit-course/edit-course.component';
import { UsercourseviewComponent } from './usercourseview/usercourseview.component';
import { SinglecourseviewComponent } from './singlecourseview/singlecourseview.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { EnrollmentManagementComponent } from './enrollment-management/enrollment-management.component';
import { UserEnrollmentComponent } from './user-enrollment/user-enrollment.component';
import { EditEnrollmentComponent } from './edit-enrollment/edit-enrollment.component';

@NgModule({
  declarations: [
    AppComponent,
    UserFormComponent,
    CourseComponent,
    CourseViewComponent,
    EditCourseComponent,
    UsercourseviewComponent,
    SinglecourseviewComponent,
    UserLoginComponent,
    EnrollmentManagementComponent,
    UserEnrollmentComponent,
    EditEnrollmentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
