import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CourseService {
    constructor(private http: HttpClient) { }

    private baseUrl = 'http://127.0.0.1:8000';

    getStates(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/states/`);
        
    }

    getCities(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/city/`);
    }

    createUser(userData: any): Observable<any[]> {
        return this.http.post<any>(`${this.baseUrl}/users/`, userData);
    }

    getUser(userId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/users/${userId}`);
    }

    getCourses(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/courses/`);
    }

    getCourseById(courseId: number): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/courses/${courseId}/`);
    }

    getCategories(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/categories/`);
    }

    createCourse(courseData: any): Observable<any[]> {
        return this.http.post<any>(`${this.baseUrl}/courses/`, courseData);
    }

    deleteCourse(courseId: number): Observable<any[]> {
        return this.http.delete<any[]>(`${this.baseUrl}/courses/${courseId}/`);
    }

    updateCourse(courseId: number, courseData: any): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/courses/${courseId}/`, courseData);
    }

    searchCourses(searchTerm: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/courses/?search=${searchTerm}`);
    }

    userLogin(data:any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/login/`, data);
    }

    courseEnroll(data:any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/enroll/`, data);
    }
    
    enrollManagement(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/enrollManagement/`);
    }

    courseFilter(courseId: number): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/courseFilter/${courseId}/`);
    }

    deleteEnrollment(enrollmentId: number): Observable<any> {
        return this.http.delete<any>(`${this.baseUrl}/courseFilter/${enrollmentId}/`);
    }

    userEnrollment(id: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/usercourseFilter/${id}/`);
    }

    getEnrollById(id: number): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/editenroll/${id}/`);
    }

    updateEnroll(id: number,data:any): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/editenroll/${id}/`,data);
    }
}