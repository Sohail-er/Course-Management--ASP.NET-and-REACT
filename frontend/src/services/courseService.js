import apiService from './api.js';

class CourseService {
  // Get all courses
  async getAllCourses() {
    return await apiService.get('/courses');
  }

  // Get course by ID
  async getCourseById(id) {
    return await apiService.get(`/courses/${id}`);
  }

  // Create new course (Admin/Instructor only)
  async createCourse(courseData) {
    return await apiService.post('/courses', courseData);
  }

  // Update course (Admin/Instructor only)
  async updateCourse(id, courseData) {
    return await apiService.put(`/courses/${id}`, courseData);
  }

  // Delete course (Admin only)
  async deleteCourse(id) {
    return await apiService.delete(`/courses/${id}`);
  }

  // Enroll in a course (User only)
  async enrollInCourse(courseId) {
    return await apiService.post(`/courses/${courseId}/enroll`);
  }

  // Unenroll from a course (User only)
  async unenrollFromCourse(courseId) {
    return await apiService.delete(`/courses/${courseId}/unenroll`);
  }

  // Get user's enrolled courses
  async getEnrolledCourses() {
    return await apiService.get('/users/enrolled-courses');
  }

  // Get courses by instructor
  async getCoursesByInstructor(instructorId) {
    return await apiService.get(`/courses/instructor/${instructorId}`);
  }

  // Search courses
  async searchCourses(query) {
    return await apiService.get(`/courses/search?q=${encodeURIComponent(query)}`);
  }

  // Get available courses (User only)
  async getAvailableCourses() {
    return await apiService.get('/courses/available');
  }

  // Get all courses (Admin only)
  async getAllCoursesAdmin() {
    return await apiService.get('/courses/all');
  }
}

const courseService = new CourseService();
export default courseService; 