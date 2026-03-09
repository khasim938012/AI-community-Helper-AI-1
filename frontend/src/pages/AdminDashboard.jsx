import { Users, FileText, AlertTriangle, TrendingUp, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-[#0F0C29] text-white overflow-hidden">
      {/* Admin Sidebar */}
      <div className="w-64 bg-[#0a0614] border-r border-gray-800 flex flex-col h-full">
        <div className="p-6">
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 tracking-wider">
            ADMIN PORTAL
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-[#1a1532] text-white border-l-4 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
            <TrendingUp size={18} className="text-red-400" />
            <span className="font-semibold text-sm">Overview Analytics</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-[#1a1532] text-gray-400 hover:text-white transition-colors">
            <Users size={18} />
            <span className="font-semibold text-sm">User Management</span>
          </button>
           <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-[#1a1532] text-gray-400 hover:text-white transition-colors">
            <FileText size={18} />
            <span className="font-semibold text-sm">Scheme Applications</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-[#1a1532] text-gray-400 hover:text-white transition-colors">
            <AlertTriangle size={18} className="text-yellow-500" />
            <span className="font-semibold text-sm">Fraud Reports</span>
          </button>
        </nav>
        <div className="p-4 border-t border-gray-800">
           <button 
             onClick={() => navigate('/')}
             className="w-full py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-bold text-gray-300 transition-colors"
           >
             Exit Admin Mode
           </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#110B19] to-[#0F0C29] p-8">
         <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-extrabold text-white tracking-wide">Command Center</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder="Search user ID or scheme..." className="bg-[#161329] border border-gray-700 focus:border-red-500 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none w-64" />
            </div>
         </div>

         {/* Stats Cards */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card-bg border-t-4 border-blue-500">
                <p className="text-gray-400 text-sm font-semibold mb-1">Total Users</p>
                <h3 className="text-3xl font-black text-white">45,231</h3>
                <p className="text-blue-400 text-xs mt-2 font-bold flex items-center">↑ 12% this week</p>
            </div>
            <div className="card-bg border-t-4 border-green-500">
                <p className="text-gray-400 text-sm font-semibold mb-1">Total Applications</p>
                <h3 className="text-3xl font-black text-white">12,894</h3>
                 <p className="text-green-400 text-xs mt-2 font-bold flex items-center">↑ 8% this week</p>
            </div>
            <div className="card-bg border-t-4 border-purple-500">
                <p className="text-gray-400 text-sm font-semibold mb-1">AI Forms Autofilled</p>
                <h3 className="text-3xl font-black text-white">8,405</h3>
                 <p className="text-purple-400 text-xs mt-2 font-bold flex items-center">Saved ~1.2M mins</p>
            </div>
            <div className="card-bg border-t-4 border-red-500">
                <p className="text-gray-400 text-sm font-semibold mb-1">Scams Detected</p>
                <h3 className="text-3xl font-black text-white">432</h3>
                 <p className="text-red-400 text-xs mt-2 font-bold flex items-center">URLs Blocked</p>
            </div>
         </div>

         {/* Charts & Tables Area */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 card-bg min-h-[400px]">
               <h4 className="font-bold text-lg mb-4 text-gray-200">System Usage & Traffic</h4>
               <div className="w-full h-64 bg-gradient-to-r from-gray-800 to-[#161329] rounded-lg flex items-center justify-center border border-gray-700">
                  <span className="text-gray-500 text-sm font-medium">[ AI Traffic Visualization Chart Placeholder ]</span>
               </div>
            </div>

            <div className="card-bg min-h-[400px]">
               <h4 className="font-bold text-lg mb-4 text-gray-200">Most Popular Schemes</h4>
               <div className="space-y-4">
                  {[
                    {name: "PM Kisan Samman Nidhi", applicants: 4500},
                    {name: "Ayushman Bharat", applicants: 3200},
                    {name: "Post-Matric Scholarship", applicants: 2150},
                    {name: "Agniveer Recruitment", applicants: 1800},
                  ].map((s, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-gray-800 pb-3">
                        <span className="text-sm font-semibold text-gray-300">{s.name}</span>
                        <span className="text-xs bg-indigo-900/60 text-indigo-300 px-2 py-1 rounded-md font-bold">{s.applicants} applies</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
