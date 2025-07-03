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
import Badge from "../components/ui/Badge.jsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/Tabs.jsx";
import courseService from "../services/courseService.js";
import { Alert, AlertDescription } from "../components/ui/Alert.jsx";
import "./UserDashboard.css";

// Mock data - fallback courses if API fails
const mockCourses = [
  {
    id: "1",
    title: "Introduction to React",
    description:
      "Learn the basics of React development including components, state, and props.",
    instructor: "John Smith",
    instructorId: "3",
    category: "Web Development",
    duration: "8 weeks",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Advanced JavaScript",
    description:
      "Master advanced JavaScript concepts including closures, promises, and async/await.",
    instructor: "Jane Doe",
    instructorId: "4",
    category: "Programming",
    duration: "10 weeks",
    createdAt: "2024-01-20",
  },
  {
    id: "3",
    title: "Node.js Backend Development",
    description:
      "Build scalable backend applications with Node.js and Express.",
    instructor: "Mike Johnson",
    instructorId: "5",
    category: "Backend",
    duration: "12 weeks",
    createdAt: "2024-01-25",
  },
  {
    id: "4",
    title: "React Advanced Patterns",
    description:
      "Master advanced React patterns and techniques for professional development.",
    instructor: "John Smith",
    instructorId: "3",
    category: "Web Development",
    duration: "6 weeks",
    createdAt: "2024-02-01",
  },
];

// Mock enrolled course IDs
const mockEnrolledCourseIds = ["1"];

function UserDashboard() {
  const { user, logout } = useAuth();
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrollingCourse, setEnrollingCourse] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      // Load available and enrolled courses from API
      const availableCoursesData = await courseService.getAvailableCourses();
      const enrolledCoursesData = await courseService.getEnrolledCourses();
      const allCourses = [
        ...(availableCoursesData || []),
        ...(enrolledCoursesData || []),
      ];
      // Remove duplicates by ID
      const uniqueCourses = allCourses.filter(
        (course, index, self) =>
          index === self.findIndex((c) => c.id === course.id)
      );
      setCourses(uniqueCourses);
      let enrolledIds = [];
      if (enrolledCoursesData && enrolledCoursesData.length > 0) {
        enrolledIds = enrolledCoursesData.map((course) => course.id);
      }
      setEnrolledCourses(enrolledIds);
    } catch (err) {
      setCourses([]);
      setEnrolledCourses([]);
      setError("");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      setEnrollingCourse(courseId);
      await courseService.enrollInCourse(courseId);
      await loadData(); // Refresh data after enrolling
    } catch (err) {
      setError("Failed to enroll in course: " + err.message);
    } finally {
      setEnrollingCourse(null);
    }
  };

  const handleUnenroll = async (courseId) => {
    try {
      setEnrollingCourse(courseId);
      await courseService.unenrollFromCourse(courseId);
      setEnrolledCourses(enrolledCourses.filter((id) => id !== courseId));
    } catch (err) {
      setError("Failed to unenroll from course: " + err.message);
    } finally {
      setEnrollingCourse(null);
    }
  };

  // My Courses: all courses whose ID is in enrolledCourses
  const myCourses = courses.filter((course) =>
    enrolledCourses.includes(course.id)
  );
  // Available Courses: all courses not enrolled
  const availableCourses = courses.filter(
    (course) => !enrolledCourses.includes(course.id)
  );
  // Total available courses count
  const totalAvailableCourses = availableCourses.length;

  return (
    <ProtectedRoute requiredRole="User">
      <div className="user-orange-bg min-h-screen">
        {/* Header */}
        <header className="user-orange-header shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div>
                <h1 className="user-orange-title">Student Dashboard</h1>
                <p className="user-orange-desc">Welcome back, {user?.name}</p>
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 user-orange-card">
          {/* Error Display */}
          {error && (
            <Alert className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading courses...</p>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Enrolled Courses
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
                <div className="text-2xl font-bold">
                  {enrolledCourses.length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Available Courses
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
                <div className="text-2xl font-bold">
                  {totalAvailableCourses}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completion Rate
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
                <div className="text-2xl font-bold">75%</div>
              </CardContent>
            </Card>
          </div>

          {/* Course Tabs */}
          <Tabs defaultValue="my-courses" className="space-y-6">
            <TabsList>
              <TabsTrigger value="my-courses">My Courses</TabsTrigger>
              <TabsTrigger value="available-courses">
                Available Courses
              </TabsTrigger>
            </TabsList>

            <TabsContent value="my-courses" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>My Enrolled Courses</CardTitle>
                  <CardDescription>
                    Courses you are currently enrolled in
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {myCourses.length === 0 ? (
                    <div className="text-center py-8">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
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
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No enrolled courses
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Get started by enrolling in a course from the available
                        courses tab.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {myCourses.map((course) => (
                        <Card
                          key={course.id}
                          className="hover:shadow-md transition-shadow"
                        >
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <Badge variant="secondary">
                                {course.category}
                              </Badge>
                              <Badge variant="default">Enrolled</Badge>
                            </div>
                            <CardTitle className="text-lg">
                              {course.title}
                            </CardTitle>
                            <CardDescription>
                              {course.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex items-center text-sm text-gray-600">
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
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                  />
                                </svg>
                                {course.instructor}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
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
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                {course.duration}
                              </div>
                            </div>
                            <div className="mt-4 space-y-2">
                              <Button
                                variant="outline"
                                className="w-full bg-transparent"
                                onClick={() => handleUnenroll(course.id)}
                                disabled={enrollingCourse === course.id}
                              >
                                {enrollingCourse === course.id
                                  ? "Unenrolling..."
                                  : "Unenroll"}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="available-courses" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Available Courses</CardTitle>
                  <CardDescription>
                    Browse and enroll in available courses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {availableCourses.length === 0 ? (
                    <div className="text-center py-8">
                      <svg
                        className="mx-auto h-12 w-12 text-green-400"
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
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        All courses enrolled!
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        You are enrolled in all available courses.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {availableCourses.map((course) => (
                        <Card
                          key={course.id}
                          className="hover:shadow-md transition-shadow"
                        >
                          <CardHeader>
                            <Badge variant="secondary" className="w-fit">
                              {course.category}
                            </Badge>
                            <CardTitle className="text-lg">
                              {course.title}
                            </CardTitle>
                            <CardDescription>
                              {course.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex items-center text-sm text-gray-600">
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
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                  />
                                </svg>
                                {course.instructor}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
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
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                {course.duration}
                              </div>
                            </div>
                            <div className="mt-4">
                              <Button
                                className="w-full"
                                onClick={() => handleEnroll(course.id)}
                                disabled={enrollingCourse === course.id}
                              >
                                {enrollingCourse === course.id
                                  ? "Enrolling..."
                                  : "Enroll Now"}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default UserDashboard;
