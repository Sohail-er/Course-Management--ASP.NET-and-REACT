import { useState } from "react";
import "./LoginPage.css";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="login-orange-bg min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg login-orange-card p-8">
        <h2 className="text-3xl font-bold text-center login-orange-title mb-2">
          Contact Us
        </h2>
        <p className="text-center login-orange-desc mb-6">
          We'd love to hear from you! Fill out the form below and we'll get back
          to you soon.
        </p>
        {submitted ? (
          <div className="text-center text-green-600 font-semibold py-8">
            Thank you for contacting us!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block mb-1 font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200 login-orange-input"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block mb-1 font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200 login-orange-input"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block mb-1 font-medium text-gray-700"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200 login-orange-input"
                placeholder="Type your message here..."
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 font-semibold rounded-md login-orange-btn"
            >
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Contact;
