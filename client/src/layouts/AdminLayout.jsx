import { Outlet, Link, useNavigate } from 'react-router-dom';
import { HiOutlineLogout, HiOutlineViewGrid, HiOutlinePhotograph, HiOutlineCalendar, HiOutlineClock, HiOutlineCurrencyRupee, HiOutlineCog } from 'react-icons/hi';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <HiOutlineViewGrid className="mr-3 text-xl" /> },
    { name: 'Gallery', path: '/admin/gallery', icon: <HiOutlinePhotograph className="mr-3 text-xl" /> },
    { name: 'Events', path: '/admin/events', icon: <HiOutlineCalendar className="mr-3 text-xl" /> },
    { name: 'Aarti', path: '/admin/aarti', icon: <HiOutlineClock className="mr-3 text-xl" /> },
    { name: 'Donations', path: '/admin/donations', icon: <HiOutlineCurrencyRupee className="mr-3 text-xl" /> },
    { name: 'Settings', path: '/admin/settings', icon: <HiOutlineCog className="mr-3 text-xl" /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-maroon-900 text-cream-100 hidden md:flex flex-col">
        <div className="p-6 border-b border-maroon-800">
          <h2 className="text-2xl font-bold text-gold-500 font-devanagari">चारधाम मन्दिर</h2>
          <p className="text-sm opacity-80 mt-1">Admin Panel</p>
        </div>
        
        <nav className="flex-grow p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center w-full px-4 py-3 rounded-lg hover:bg-saffron-600 transition-colors"
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t border-maroon-800">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-red-300 hover:bg-maroon-800 rounded-lg transition-colors"
          >
            <HiOutlineLogout className="mr-3 text-xl" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white shadow-sm md:hidden flex items-center justify-between p-4">
          <h2 className="text-xl font-bold text-maroon-900">Admin Panel</h2>
          <button onClick={handleLogout} className="text-red-500 p-2">
            <HiOutlineLogout size={24} />
          </button>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
