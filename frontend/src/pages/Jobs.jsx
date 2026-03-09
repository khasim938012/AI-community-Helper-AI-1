import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const jobs = [
  {
    title: "Indian Army Agniveer",
    desc: "Join the Armed Forces. 10th/12th Pass."
  },
  {
    title: "SSC CGL Recruitment",
    desc: "Staff Selection Commission Group B/C Officers."
  },
  {
    title: "SSC CHSL (10+2)",
    desc: "Combined Higher Secondary Level for Clerks/LDC."
  },
  {
    title: "SSC MTS (Non-Technical)",
    desc: "Multi Tasking Staff in Central Government."
  },
  {
    title: "SSC GD Constable",
    desc: "General Duty Constable in CAPFs, NIA, SSF."
  },
  {
    title: "RRB NTPC",
    desc: "Railway Recruitment Board Non-Technical (Clerks, Station Master)."
  },
  {
    title: "RRB Group D",
    desc: "Railway Recruitment Cell Group D Posts."
  },
  {
    title: "RRB ALP & Technician",
    desc: "Assistant Loco Pilot and Technician in Railways."
  },
  {
    title: "UPSC Civil Services (IAS/IPS)",
    desc: "Premier administrative civil services."
  }
];

const Jobs = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold uppercase tracking-widest text-white">Jobs</h1>
        <button 
          onClick={() => navigate(-1)}
          className="bg-[#1a1532] border border-gray-700 hover:border-gray-500 text-gray-300 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors text-sm font-semibold"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job, idx) => (
          <div key={idx} className="card-bg flex flex-col justify-between hover:border-purple-500 transition-colors">
            <div>
              <h3 className="text-lg font-bold text-white mb-3">{job.title}</h3>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                {job.desc}
              </p>
            </div>
            <button className="w-full btn-primary shadow-lg">
              VIEW DETAILS
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Jobs;
