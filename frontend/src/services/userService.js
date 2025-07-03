import apiService from './api.js';

class UserService {
  // Get all users (Admin only)
  async getAllUsers() {
    return await apiService.get('/users');
  }

  // Get user by ID
  async getUserById(id) {
    return await apiService.get(`/users/${id}`);
  }

  // Create new instructor (Admin only)
  async createInstructor(instructorData) {
    return await apiService.post('/users/instructors', instructorData);
  }

  // Update user
  async updateUser(id, userData) {
    return await apiService.put(`/users/${id}`, userData);
  }

  // Delete user (Admin only)
  async deleteUser(id) {
    return await apiService.delete(`/users/${id}`);
  }

  // Toggle user active status (Admin only)
  async toggleUserStatus(id) {
    return await apiService.put(`/users/${id}/toggle-status`);
  }

  // Get instructors only
  async getInstructors() {
    return await apiService.get('/users/instructors');
  }

  // Get students only
  async getStudents() {
    return await apiService.get('/users/students');
  }

  // Get user profile
  async getUserProfile() {
    return await apiService.get('/users/profile');
  }

  // Update user profile
  async updateUserProfile(profileData) {
    return await apiService.put('/users/profile', profileData);
  }

  // Delete instructor (Admin only)
  async deleteInstructor(id) {
    return await apiService.delete(`/users/instructors/${id}`);
  }

  // Toggle instructor active status (Admin only)
  async toggleInstructorStatus(id) {
    return await apiService.put(`/users/instructors/${id}/toggle-status`);
  }
}

const userService = new UserService();
export default userService; 