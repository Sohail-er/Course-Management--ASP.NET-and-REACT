import { useEffect, useState } from "react";
import courseService from "../services/courseService";
import { Link } from "react-router-dom";
import "./Courses.css";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const data = await courseService.getAllCourses();
        setCourses(data);
      } catch (err) {
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="courses-page">
      <h2>All Courses</h2>
      <div className="courses-list-horizontal">
        {courses.length === 0 ? (
          <p>No courses available.</p>
        ) : (
          courses.map((course) => {
            const imageQuery = course.category
              ? `${encodeURIComponent(course.category)},education,learning`
              : `learning,education`;
            return (
              <div key={course.id} className="course-card-horizontal">
                <img
                  src={`https://images.unsplash.com/photo-1610758758876-0680d8c2247c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`}
                  alt={course.title}
                  className="course-card-image"
                />
                <div className="course-card-content">
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <Link to={`/courses/${course.id}`}>View Details</Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Courses;
