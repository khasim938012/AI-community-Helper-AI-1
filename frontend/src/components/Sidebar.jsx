import { Link, useLocation } from 'react-router-dom';
import { Mic, Landmark, ShieldCheck, Bell, Briefcase, MapPin, GraduationCap, FileText, Phone } from 'lucide-react';
import clsx from 'clsx';

const menuItems = [
  { path: '/', label: '1. Voice Assistant', icon: Mic },
  { path: '/schemes', label: '2. Govt Schemes', icon: Landmark },
  { path: '/scam-detector', label: '3. Scam Detector', icon: ShieldCheck },
  { path: '/alerts', label: '4. Smart Alerts', icon: Bell },
  { path: '/jobs', label: '5. Scholarships & Jobs', icon: Briefcase },
  { path: '/gps', label: '6. Nearby GPS', icon: MapPin },
  { path: '/skills', label: '7. Skills', icon: GraduationCap },
  { path: '/forms', label: '8. Form Guidance', icon: FileText },
  { path: '/sos', label: '9. Emergency SOS', icon: Phone },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-[#0a0614] border-r border-gray-800 text-gray-300 flex flex-col h-full overflow-y-auto">
      <div className="p-6 flex items-center space-x-3">
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg p-2">
           <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        </div>
        <h1 className="text-xl font-bold text-white tracking-widest">AICORE</h1>
      </div>
      
      <nav className="flex-1 px-4 pb-4 space-y-1 mt-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium',
                isActive 
                  ? 'bg-[#1a1532] text-white border-l-4 border-pink-500 shadow-[inset_0_0_15px_rgba(233,30,99,0.1)]' 
                  : 'hover:bg-[#1a1532] hover:text-white border-l-4 border-transparent'
              )}
            >
              <Icon size={18} className={clsx(isActive ? "text-pink-400" : "text-gray-400")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
