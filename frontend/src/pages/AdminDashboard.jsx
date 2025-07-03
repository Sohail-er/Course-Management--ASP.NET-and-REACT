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
import Badge from "../components/ui/Badge.jsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/Dialog.jsx";
import Switch from "../components/ui/Switch.jsx";
import { Alert, AlertDescription } from "../components/ui/Alert.jsx";
import userService from "../services/userService.js";
import courseService from "../services/courseService.js";
import "./AdminDashboard.css";

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

function AdminDashboard() {
  const { user, logout } = useAuth();
  const [instructors, setInstructors] = useState([]);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddingInstructor, setIsAddingInstructor] = useState(false);
  const [newInstructor, setNewInstructor] = useState({
    name: "",
    email: "",
    specialization: "",
    password: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [instructorsData, usersData, coursesData] = await Promise.all([
        userService.getInstructors(),
        userService.getStudents(),
        courseService.getAllCourses(),
      ]);
      setInstructors(instructorsData);
      setUsers(usersData);
      setCourses(coursesData);
    } catch (err) {
      setError("Failed to load data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddInstructor = async () => {
    try {
      setError("");
      const instructor = await userService.createInstructor(newInstructor);
      setInstructors([...instructors, instructor]);
      setNewInstructor({
        name: "",
        email: "",
        specialization: "",
        password: "",
      });
      setIsAddingInstructor(false);
    } catch (err) {
      setError("Failed to add instructor: " + err.message);
    }
  };

  const handleToggleInstructorStatus = async (instructorId) => {
    try {
      await userService.toggleInstructorStatus(instructorId);
      setInstructors(
        instructors.map((instructor) =>
          instructor.id === instructorId
            ? { ...instructor, isActive: !instructor.isActive }
            : instructor
        )
      );
    } catch (err) {
      setError("Failed to toggle instructor status: " + err.message);
    }
  };

  const handleDeleteInstructor = async (instructorId) => {
    try {
      await userService.deleteInstructor(instructorId);
      setInstructors(
        instructors.filter((instructor) => instructor.id !== instructorId)
      );
    } catch (err) {
      setError("Failed to delete instructor: " + err.message);
    }
  };

  const activeInstructors = instructors.filter(
    (instructor) => instructor.isActive
  );

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
    <ProtectedRoute requiredRole="Admin">
      <div className="admin-orange-bg min-h-screen">
        {/* Header */}
        <header className="admin-orange-header shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div>
                <h1 className="admin-orange-title">Admin Dashboard</h1>
                <p className="admin-orange-desc">Welcome back, {user?.name}</p>
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 admin-orange-card">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Instructors
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{instructors.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Instructors
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
                <div className="text-2xl font-bold">
                  {activeInstructors.length}
                </div>
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
                <div className="text-2xl font-bold">{users.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Courses
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
          </div>

          {/* Instructor Management */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Instructor Management</CardTitle>
                  <CardDescription>
                    Add, manage, and control instructor access
                  </CardDescription>
                </div>
                <Button onClick={() => setIsAddingInstructor(true)}>
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
                  Add Instructor
                </Button>
                <Dialog
                  open={isAddingInstructor}
                  onOpenChange={setIsAddingInstructor}
                >
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Instructor</DialogTitle>
                      <DialogDescription>
                        Create a new instructor account.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={newInstructor.name}
                          onChange={(e) =>
                            setNewInstructor({
                              ...newInstructor,
                              name: e.target.value,
                            })
                          }
                          placeholder="Enter full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newInstructor.email}
                          onChange={(e) =>
                            setNewInstructor({
                              ...newInstructor,
                              email: e.target.value,
                            })
                          }
                          placeholder="Enter email address"
                        />
                      </div>
                      <div>
                        <Label htmlFor="specialization">Specialization</Label>
                        <Input
                          id="specialization"
                          value={newInstructor.specialization}
                          onChange={(e) =>
                            setNewInstructor({
                              ...newInstructor,
                              specialization: e.target.value,
                            })
                          }
                          placeholder="Enter specialization"
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={newInstructor.password}
                          onChange={(e) =>
                            setNewInstructor({
                              ...newInstructor,
                              password: e.target.value,
                            })
                          }
                          placeholder="Enter password"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsAddingInstructor(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleAddInstructor}>
                          Add Instructor
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {instructors.map((instructor) => (
                  <div
                    key={instructor.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-medium">{instructor.name}</h3>
                        <p className="text-sm text-gray-600">
                          {instructor.email}
                        </p>
                        <p className="text-sm text-gray-500">
                          {instructor.specialization}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={instructor.isActive ? "default" : "secondary"}
                      >
                        {instructor.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Switch
                        checked={instructor.isActive}
                        onCheckedChange={() =>
                          handleToggleInstructorStatus(instructor.id)
                        }
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteInstructor(instructor.id)}
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
      </div>
    </ProtectedRoute>
  );
}

export default AdminDashboard;
