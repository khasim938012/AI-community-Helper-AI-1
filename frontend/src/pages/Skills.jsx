import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const courses = [
  {
    title: "NPTEL Python for Data Science",
    provider: "Free programming course by IITs.",
    icon: "🐍",
    colors: "from-green-400 to-blue-500",
    tags: ["CERTIFICATE", "100% FREE"]
  },
  {
    title: "Google IT Support Professional",
    provider: "Free tech fundamentals course.",
    icon: "🖥️",
    colors: "from-blue-400 to-blue-600",
    tags: ["CERTIFICATE", "100% FREE"]
  },
  {
    title: "AWS Cloud Practitioner",
    provider: "Free introduction to cloud computing and AWS.",
    icon: "☁️",
    colors: "from-purple-400 to-purple-600",
    tags: ["CERTIFICATE", "100% FREE"]
  },
  {
    title: "Full Stack Web Development",
    provider: "Learn frontend and backend technologies.",
    icon: "🌐",
    colors: "from-cyan-400 to-blue-500",
    tags: ["CERTIFICATE", "100% FREE"]
  },
  {
    title: "Swayam Java Programming",
    provider: "Comprehensive Java course by Govt of India.",
    icon: "☕",
    colors: "from-red-400 to-orange-500",
    tags: ["CERTIFICATE", "100% FREE"]
  },
  {
    title: "Cyber Security Essentials",
    provider: "Learn basics of network and data security.",
    icon: "🛡️",
    colors: "from-indigo-400 to-blue-600",
    tags: ["CERTIFICATE", "100% FREE"]
  }
];

const Skills = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold uppercase tracking-widest text-white">Education</h1>
        <button 
          onClick={() => navigate(-1)}
          className="bg-[#1a1532] border border-gray-700 hover:border-gray-500 text-gray-300 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors text-sm font-semibold"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-pink-500 mb-2">{">"} Technical / IT</h2>
        <div className="h-[1px] w-full bg-gradient-to-r from-pink-500/50 to-transparent"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, idx) => (
          <div key={idx} className="card-bg flex flex-col items-center text-center hover:border-blue-500 transition-colors group">
            <div className={`text-6xl mb-6 mt-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]`}>
              {course.icon}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{course.title}</h3>
            <p className="text-sm text-gray-400 mb-4 h-10">
              {course.provider}
            </p>
            
            <div className="flex space-x-2 mb-6 w-full justify-center">
              {course.tags.map((tag, i) => (
                <span key={i} className={`text-xs font-bold px-3 py-1 rounded-full ${i === 0 ? 'bg-indigo-900/50 text-indigo-300' : 'bg-green-900/50 text-green-400'}`}>
                  {tag}
                </span>
              ))}
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors shadow-lg">
              ENROLL FOR FREE
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
