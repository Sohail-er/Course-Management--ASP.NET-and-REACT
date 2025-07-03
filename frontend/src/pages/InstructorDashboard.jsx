"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import Button from "../components/ui/Button.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/Card.jsx";
import Input from "../components/ui/Input.jsx";
import Label from "../components/ui/Label.jsx";
import Textarea from "../components/ui/Textarea.jsx";
import Badge from "../components/ui/Badge.jsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/Dialog.jsx";
import { Alert, AlertDescription } from "../components/ui/Alert.jsx";
import courseService from "../services/courseService.js";
import "./InstructorDashboard.css";

// Mock data - courses created by this instructor (fallback)
const mockInstructorCourses = [
  {
    id: "1",
    title: "Introduction to React",
    description: "Learn the basics of React development",
    instructor: "John Smith",
    instructorId: "3", // Current instructor's ID
    category: "Web Development",
    duration: "8 weeks",
    createdAt: "2024-01-15",
  },
  {
    id: "4",
    title: "React Advanced Patterns",
    description: "Master advanced React patterns and techniques",
    instructor: "John Smith",
    instructorId: "3", // Current instructor's ID
    category: "Web Development",
    duration: "6 weeks",
    createdAt: "2024-02-01",
  },
];

function InstructorDashboard() {
  const { user, logout } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    category: "",
    duration: "",
  });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const coursesData = await courseService.getCoursesByInstructor(user.id);

      // Combine hardcoded courses with API courses
      const apiCourses = coursesData || [];
      const allCourses = [...mockInstructorCourses, ...apiCourses];

      // Remove duplicates based on title (in case API returns same courses)
      const uniqueCourses = allCourses.filter(
        (course, index, self) =>
          index === self.findIndex((c) => c.title === course.title)
      );

      setCourses(uniqueCourses);
      console.log(
        "Combined courses - Hardcoded:",
        mockInstructorCourses.length,
        "API:",
        apiCourses.length,
        "Total:",
        uniqueCourses.length
      );
    } catch (err) {
      console.error(
        "Failed to load courses from API, using only hardcoded courses:",
        err.message
      );
      setError("Failed to load courses from API: " + err.message);
      // Use only hardcoded courses if API fails
      setCourses(mockInstructorCourses);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async () => {
    try {
      setError("");
      const course = await courseService.createCourse({
        ...newCourse,
        instructorId: user.id,
      });

      // Add the new course to the existing list
      setCourses((prevCourses) => [...prevCourses, course]);
      setNewCourse({ title: "", description: "", category: "", duration: "" });
      setIsAddingCourse(false);

      console.log("Course added successfully:", course.title);
    } catch (err) {
      setError("Failed to add course: " + err.message);
    }
  };

  const handleEditCourse = async (updatedCourse) => {
    try {
      setError("");
      const course = await courseService.updateCourse(
        updatedCourse.id,
        updatedCourse
      );
      const updatedCourses = courses.map((c) =>
        c.id === course.id ? course : c
      );
      setCourses(updatedCourses);
      setEditingCourse(null);
    } catch (err) {
      setError("Failed to update course: " + err.message);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      console.log("Deleting course:", courseId);
      await courseService.deleteCourse(courseId);
      console.log("Course deleted successfully from API");
      setCourses(courses.filter((c) => c.id !== courseId));
      console.log("Course removed from frontend state");
    } catch (err) {
      console.error("Failed to delete course:", err);
      setError("Failed to delete course: " + err.message);
    }
  };

  const startEditCourse = (course) => {
    setEditingCourse(course);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole="Instructor">
      <div className="instructor-orange-bg min-h-screen">
        {/* Header */}
        <header className="instructor-orange-header shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div>
                <h1 className="instructor-orange-title">
                  Instructor Dashboard
                </h1>
                <p className="instructor-orange-desc">
                  Welcome back, {user?.name}
                </p>
              </div>
              <Button onClick={logout} variant="outline">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </Button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 instructor-orange-card">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  My Courses
                </CardTitle>
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{courses.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Students
                </CardTitle>
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Enrollments
                </CardTitle>
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18</div>
              </CardContent>
            </Card>
          </div>

          {/* Course Management */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>My Courses</CardTitle>
                  <CardDescription>
                    Create and manage your courses
                  </CardDescription>
                </div>
                <Button onClick={() => setIsAddingCourse(true)}>
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add Course
                </Button>
                <Dialog open={isAddingCourse} onOpenChange={setIsAddingCourse}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Course</DialogTitle>
                      <DialogDescription>
                        Create a new course for students to enroll in.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Course Title</Label>
                        <Input
                          id="title"
                          value={newCourse.title}
                          onChange={(e) =>
                            setNewCourse({
                              ...newCourse,
                              title: e.target.value,
                            })
                          }
                          placeholder="Enter course title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={newCourse.description}
                          onChange={(e) =>
                            setNewCourse({
                              ...newCourse,
                              description: e.target.value,
                            })
                          }
                          placeholder="Enter course description"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Input
                          id="category"
                          value={newCourse.category}
                          onChange={(e) =>
                            setNewCourse({
                              ...newCourse,
                              category: e.target.value,
                            })
                          }
                          placeholder="e.g., Web Development, Data Science"
                        />
                      </div>
                      <div>
                        <Label htmlFor="duration">Duration</Label>
                        <Input
                          id="duration"
                          value={newCourse.duration}
                          onChange={(e) =>
                            setNewCourse({
                              ...newCourse,
                              duration: e.target.value,
                            })
                          }
                          placeholder="e.g., 8 weeks, 3 months"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsAddingCourse(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleAddCourse}>Add Course</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{course.title}</h3>
                        <Badge>{course.category}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {course.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm text-gray-500">
                          Duration: {course.duration}
                        </span>
                        <span className="text-sm text-gray-500">
                          Created:{" "}
                          {new Date(course.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEditCourse(course)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCourse(course.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Edit Course Dialog */}
        <Dialog
          open={!!editingCourse}
          onOpenChange={() => setEditingCourse(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Course</DialogTitle>
              <DialogDescription>
                Update your course information.
              </DialogDescription>
            </DialogHeader>
            {editingCourse && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-title">Course Title</Label>
                  <Input
                    id="edit-title"
                    value={editingCourse.title}
                    onChange={(e) =>
                      setEditingCourse({
                        ...editingCourse,
                        title: e.target.value,
                      })
                    }
                    placeholder="Enter course title"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editingCourse.description}
                    onChange={(e) =>
                      setEditingCourse({
                        ...editingCourse,
                        description: e.target.value,
                      })
                    }
                    placeholder="Enter course description"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-category">Category</Label>
                  <Input
                    id="edit-category"
                    value={editingCourse.category}
                    onChange={(e) =>
                      setEditingCourse({
                        ...editingCourse,
                        category: e.target.value,
                      })
                    }
                    placeholder="Enter course category"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-duration">Duration</Label>
                  <Input
                    id="edit-duration"
                    value={editingCourse.duration}
                    onChange={(e) =>
                      setEditingCourse({
                        ...editingCourse,
                        duration: e.target.value,
                      })
                    }
                    placeholder="e.g., 8 weeks"
                  />
                </div>
                <Button
                  onClick={() => handleEditCourse(editingCourse)}
                  className="w-full"
                >
                  Update Course
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
}

export default InstructorDashboard;
