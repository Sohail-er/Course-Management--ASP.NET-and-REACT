"use client";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import Label from "../components/ui/Label.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/Card.jsx";
import { Alert, AlertDescription } from "../components/ui/Alert.jsx";
import "./LoginPage.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User"); // Add role state
  const [error, setError] = useState("");
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = await login(email, password, role);
    if (result.success) {
      if (role === "Admin") {
        navigate("/admin/dashboard");
      } else if (role === "Instructor") {
        navigate("/instructor/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } else {
      setError(result.message); // Show backend error in popup
    }
  };

  return (
    <div className="login-orange-bg min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md login-orange-card">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center login-orange-title">
            Course Management System
          </CardTitle>
          <CardDescription className="text-center login-orange-desc">
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Sign in as</Label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-200 hover:border-orange-300"
                required
              >
                <option value="User">User</option>
                <option value="Instructor">Instructor</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-4 p-3 bg-gray-100 rounded-md">
            <p className="text-xs text-gray-600 mb-2">Demo Credentials:</p>
            <p className="text-xs">
              <strong>Admin:</strong> admin@cms.com / Admin@123
            </p>
            <p className="text-xs">
              <strong>Instructor:</strong> instructor@cms.com / Instructor@123
            </p>
            <p className="text-xs">
              <strong>User:</strong> user@example.com / password
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginPage;
