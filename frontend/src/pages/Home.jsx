import React, { useState } from "react";
import "./Home.css";
import "../App.css";

const images = [
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1673515334386-2b24073bb22f?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80",
];

function Home() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % images.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div>
      <div className="carousel-container">
        <img
          src={images[current]}
          alt={`Slide ${current + 1}`}
          className="carousel-image"
        />
        <div className="carousel-overlay-text">
          <h1 className="carousel-heading">Welcome to Codemy</h1>
          <p className="carousel-subtitle">
            Unlock your potential with a wide range of online courses.
          </p>
        </div>
        <button
          onClick={prevSlide}
          className="carousel-arrow carousel-arrow-left"
        >
          &lt;
        </button>
        <button
          onClick={nextSlide}
          className="carousel-arrow carousel-arrow-right"
        >
          &gt;
        </button>
        <div className="carousel-dots">
          {images.map((_, idx) => (
            <span
              key={idx}
              className={`carousel-dot${current === idx ? " active" : ""}`}
              onClick={() => setCurrent(idx)}
            />
          ))}
        </div>
      </div>
      {/* Our Courses Section */}
      <section className="courses-section">
        <h2 className="courses-heading">Our Courses</h2>
        <div className="courses-grid">
          <div className="course-card">
            <img
              src="https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=400&q=80"
              alt="Web Development"
              className="course-image"
            />
            <h3 className="course-title">Web Development</h3>
            <p className="course-desc">
              Learn to build modern, responsive websites and web apps from
              scratch.
            </p>
          </div>
          <div className="course-card">
            <img
              src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80"
              alt="Data Science"
              className="course-image"
            />
            <h3 className="course-title">Data Science</h3>
            <p className="course-desc">
              Master data analysis, visualization, and machine learning
              techniques.
            </p>
          </div>
          <div className="course-card">
            <img
              src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80"
              alt="Graphic Design"
              className="course-image"
            />
            <h3 className="course-title">Graphic Design</h3>
            <p className="course-desc">
              Unleash your creativity with courses on design principles and
              tools.
            </p>
          </div>
          <div className="course-card">
            <img
              src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80"
              alt="Digital Marketing"
              className="course-image"
            />
            <h3 className="course-title">Digital Marketing</h3>
            <p className="course-desc">
              Grow your business and career with digital marketing strategies.
            </p>
          </div>
        </div>
      </section>
      {/* Testimonial Section */}
      <section className="testimonial-section">
        <h2 className="testimonial-heading">What Our Learners Say</h2>
        <div className="testimonial-grid">
          <div className="testimonial-card">
            <img
              src="/fahad.jpg"
              alt="Fahad Khan"
              className="testimonial-photo"
            />
            <p className="testimonial-quote">
              “This platform helped me land my dream job! The courses are
              well-structured and easy to follow.”
            </p>
            <span className="testimonial-name">Fahad Khan</span>
          </div>
          <div className="testimonial-card">
            <img
              src="/anas.jpg"
              alt="MD Anas"
              className="testimonial-photo"
            />
            <p className="testimonial-quote">
              “I love the flexibility and the variety of courses available.
              Highly recommended for anyone wanting to learn new skills.”
            </p>
            <span className="testimonial-name">MD Anas</span>
          </div>
          <div className="testimonial-card">
            <img
              src="/yusuf.jpg"
              alt="MD Yusuf"
              className="testimonial-photo"
            />
            <p className="testimonial-quote">
              “The instructors are knowledgeable and the community is very
              supportive. A fantastic learning experience!”
            </p>
            <span className="testimonial-name">MD Yusuf</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
