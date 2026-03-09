import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import VoiceAssistant from './pages/VoiceAssistant';
import GovtSchemes from './pages/GovtSchemes';
import Jobs from './pages/Jobs';
import Skills from './pages/Skills';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<VoiceAssistant />} />
          <Route path="schemes" element={<GovtSchemes />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="skills" element={<Skills />} />
          {/* Add more routes here as needed */}
        </Route>
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
