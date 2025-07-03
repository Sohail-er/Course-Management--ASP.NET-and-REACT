import "./LoginPage.css";

const teamMembers = [
  {
    name: "Sohail Khan",
    role: "Developer",
    image: process.env.PUBLIC_URL + "/photo.jpg", // Use local image from public folder
  },
  {
    name: "Suchi",
    role: "Developer",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Lakshit Dogra",
    role: "Developer",
    image:
      "https://media.licdn.com/dms/image/v2/D4D03AQGqnbfmkB05Yw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1694092133915?e=2147483647&v=beta&t=0PfMr743cIgZtF5yjb0WEeY_BDOe5duX54eTFuxWZxk",
  },
];

function About() {
  return (
    <div className="login-orange-bg min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl login-orange-card p-8 mb-10 mx-auto">
        <h2 className="text-3xl font-bold text-center login-orange-title mb-2">
          About Us
        </h2>
        <p className="text-gray-700">
          Codemy is dedicated to making learning and
          teaching easier for everyone. Our platform helps students,
          instructors, and administrators manage courses, enrollments, and
          progress with ease.
        </p>
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-orange-600 mb-2">
            Our Mission
          </h3>
          <p className="text-gray-700 mb-4">
            To empower education through technology by providing a simple,
            modern, and effective course management experience for all users.
          </p>
          <h3 className="text-xl font-semibold text-orange-600 mb-2">
            Our Team
          </h3>
          <p className="text-gray-700">
            We are a passionate group of developers, educators, and designers
            committed to building tools that make a difference in the world of
            online learning.
          </p>
        </div>
      </div>
      <div className="flex flex-row flex-wrap justify-center items-stretch gap-8 w-full max-w-4xl mx-auto mb-8">
        {teamMembers.map((member, idx) => (
          <div
            key={idx}
            className="team-card bg-white rounded-xl shadow-md border-2 border-orange-100 flex flex-col items-center p-6 w-72 transition-all duration-200 hover:shadow-lg hover:border-orange-300"
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-orange-200 mb-4 shadow-sm"
            />
            <div className="text-xl font-bold text-orange-600 mb-1">
              {member.name}
            </div>
            <div className="text-md text-gray-700 font-medium">
              {member.role}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default About;
