import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Gallery from './pages/public/Gallery';
import Aarti from './pages/public/Aarti';
import Events from './pages/public/Events';
import Donate from './pages/public/Donate';
import Contact from './pages/public/Contact';
import Trust from './pages/public/Trust';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import { AdminSettings, AdminDonations, AdminAarti, AdminEvents, AdminGallery, AdminShrines, AdminDonationRecords, AdminMessages } from './pages/admin/AdminManagers';
import Receipt from './pages/public/Receipt';

// Placeholder Auth Guard
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('adminToken'); // Simple check for now
  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Toaster position="top-center" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="aarti" element={<Aarti />} />
          <Route path="events" element={<Events />} />
          <Route path="donate" element={<Donate />} />
          <Route path="receipt" element={<Receipt />} />
          <Route path="contact" element={<Contact />} />
          <Route path="trust" element={<Trust />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="aarti" element={<AdminAarti />} />
          <Route path="donations" element={<AdminDonations />} />
          <Route path="verify-donations" element={<AdminDonationRecords />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="shrines" element={<AdminShrines />} />
          <Route path="messages" element={<AdminMessages />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
