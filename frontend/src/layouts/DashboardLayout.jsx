import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-[#0F0C29] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-b from-[#110B19] to-[#0F0C29]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
