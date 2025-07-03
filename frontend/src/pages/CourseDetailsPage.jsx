"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import courseService from "../services/courseService";

function CourseDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const data = await courseService.getCourseById(params.id);
        setCourse(data);
      } catch {
        setCourse(null);
      } finally {
        setLoading(false);
      }
    }
    fetchCourse();
  }, [params.id]);

  const handleEnrollment = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsEnrolled(!isEnrolled);
    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;
  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Course not found</h2>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      {course.category}
                    </Badge>
                    <CardTitle className="text-3xl">{course.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Course Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-5 h-5 text-gray-400"
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
                    <div>
                      <p className="text-sm text-gray-500">Instructor</p>
                      <p className="font-medium">{course.instructor}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-5 h-5 text-gray-400"
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
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium">{course.duration}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Created</p>
                      <p className="font-medium">
                        {new Date(course.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    What you'll learn
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <svg
                        className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0"
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
                      <span className="text-gray-600">
                        Fundamental concepts and best practices
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <svg
                        className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0"
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
                      <span className="text-gray-600">
                        Hands-on projects and real-world examples
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <svg
                        className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0"
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
                      <span className="text-gray-600">
                        Industry-standard tools and techniques
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <svg
                        className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0"
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
                      <span className="text-gray-600">
                        Portfolio-ready projects
                      </span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Course Enrollment</CardTitle>
                <CardDescription>
                  {isEnrolled
                    ? "You are enrolled in this course"
                    : "Join this course today"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {user?.role === "User" && (
                  <Button
                    className="w-full"
                    onClick={handleEnrollment}
                    disabled={loading}
                    variant={isEnrolled ? "outline" : "default"}
                  >
                    {loading
                      ? "Processing..."
                      : isEnrolled
                      ? "Unenroll"
                      : "Enroll Now"}
                  </Button>
                )}

                {user?.role === "Admin" && (
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600">Admin View</p>
                    <p className="text-xs text-blue-500 mt-1">
                      You can manage instructors from the admin dashboard
                    </p>
                  </div>
                )}

                {user?.role === "Instructor" && (
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600">
                      {course.instructorId === user.id
                        ? "Your Course"
                        : "Instructor View"}
                    </p>
                    <p className="text-xs text-green-500 mt-1">
                      {course.instructorId === user.id
                        ? "You can edit this course from your dashboard"
                        : "This course is managed by another instructor"}
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Course Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Category:</span>
                      <span>{course.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Duration:</span>
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Level:</span>
                      <span>Beginner</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetailsPage;
