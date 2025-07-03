import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import InstructorDashboard from "./pages/InstructorDashboard.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import CourseDetailsPage from "./pages/CourseDetailsPage.jsx";
import Home from "./pages/Home.jsx";
import Navbar from "./components/ui/Navbar";
import Courses from "./pages/Courses.jsx";
import Footer from "./components/ui/Footer";
import Contact from "./pages/Contact.jsx";
import About from "./pages/About.jsx";
import "./App.css";

function AppLayout() {
  const { user } = useAuth();
  return (
    <div className="App">
      {!user && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/courses/:id" element={<CourseDetailsPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}

export default App;
