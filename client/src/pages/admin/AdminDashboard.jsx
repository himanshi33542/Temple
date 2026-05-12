import { useState, useEffect } from 'react';
import { HiOutlinePhotograph, HiOutlineCalendar, HiOutlineClock, HiOutlineCurrencyRupee, HiOutlinePlus, HiOutlineBadgeCheck, HiOutlineCreditCard, HiOutlineMail } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import API from '../../api';

const AdminDashboard = () => {
  const [statsData, setStatsData] = useState({
    galleryCount: 0,
    upcomingEvents: 0,
    aartiCount: 0,
    totalDonations: '₹ 0',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [galleryRes, eventsRes, aartiRes, shrineRes] = await Promise.all([
          API.get('/gallery'),
          API.get('/events'),
          API.get('/aarti'),
          API.get('/shrines')
        ]);
        
        setStatsData({
          galleryCount: galleryRes.data.length,
          upcomingEvents: eventsRes.data.filter(e => !e.isPast).length,
          aartiCount: aartiRes.data.length,
          shrineCount: shrineRes.data.length,
          totalDonations: '₹ --', // We don't have a real donation tracking API yet
        });
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { name: 'Total Gallery Photos', value: statsData.galleryCount, icon: HiOutlinePhotograph, color: 'bg-blue-500' },
    { name: 'Upcoming Events', value: statsData.upcomingEvents, icon: HiOutlineCalendar, color: 'bg-green-500' },
    { name: 'Shrines/Dhams', value: statsData.shrineCount, icon: HiOutlinePlus, color: 'bg-purple-500' },
    { name: 'Aarti Scheduled', value: statsData.aartiCount, icon: HiOutlineClock, color: 'bg-yellow-500' },
  ];

  if (loading) return <div className="text-center py-10 text-gray-500">Loading statistics...</div>;


  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, Admin. Here's an overview of the temple portal.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center">
            <div className={`p-4 rounded-lg ${stat.color} text-white mr-4`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <Link to="/admin/gallery" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group cursor-pointer text-left block">
          <div className="flex justify-between items-center mb-4">
            <div className="bg-blue-50 p-3 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <HiOutlinePhotograph size={24} />
            </div>
          </div>
          <h3 className="font-bold text-lg text-gray-800">Upload Photos</h3>
          <p className="text-gray-500 text-sm mt-1">Add new photos to the gallery</p>
        </Link>

        <Link to="/admin/events" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group cursor-pointer text-left block">
          <div className="flex justify-between items-center mb-4">
            <div className="bg-green-50 p-3 rounded-full text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
              <HiOutlineCalendar size={24} />
            </div>
          </div>
          <h3 className="font-bold text-lg text-gray-800">Create Event</h3>
          <p className="text-gray-500 text-sm mt-1">Schedule a new temple event</p>
        </Link>

        <Link to="/admin/aarti" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group cursor-pointer text-left block">
          <div className="flex justify-between items-center mb-4">
            <div className="bg-yellow-50 p-3 rounded-full text-yellow-600 group-hover:bg-yellow-600 group-hover:text-white transition-colors">
              <HiOutlineClock size={24} />
            </div>
          </div>
          <h3 className="font-bold text-lg text-gray-800">Update Aarti</h3>
          <p className="text-gray-500 text-sm mt-1">Modify daily aarti schedule</p>
        </Link>

        <Link to="/admin/shrines" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group cursor-pointer text-left block">
          <div className="flex justify-between items-center mb-4">
            <div className="bg-purple-50 p-3 rounded-full text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <HiOutlinePlus size={24} />
            </div>
          </div>
          <h3 className="font-bold text-lg text-gray-800">Manage Shrines</h3>
          <p className="text-gray-500 text-sm mt-1">Edit 4 Dhams & other shrines</p>
        </Link>

        <Link to="/admin/settings" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group cursor-pointer text-left block">
          <div className="flex justify-between items-center mb-4">
            <div className="bg-saffron-50 p-3 rounded-full text-saffron-600 group-hover:bg-saffron-600 group-hover:text-white transition-colors">
              <HiOutlinePlus size={24} />
            </div>
          </div>
          <h3 className="font-bold text-lg text-gray-800">Site Settings</h3>
          <p className="text-gray-500 text-sm mt-1">Edit About, Contact & Footer</p>
        </Link>

        <Link to="/admin/donations" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group cursor-pointer text-left block">
          <div className="flex justify-between items-center mb-4">
            <div className="bg-gold-50 p-3 rounded-full text-gold-600 group-hover:bg-gold-600 group-hover:text-white transition-colors">
              <HiOutlineCreditCard size={24} />
            </div>
          </div>
          <h3 className="font-bold text-lg text-gray-800">Bank/QR Settings</h3>
          <p className="text-gray-500 text-sm mt-1">Update UPI & Bank Details</p>
        </Link>

        <Link to="/admin/verify-donations" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group cursor-pointer text-left block">
          <div className="flex justify-between items-center mb-4">
            <div className="bg-green-50 p-3 rounded-full text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
              <HiOutlineBadgeCheck size={24} />
            </div>
          </div>
          <h3 className="font-bold text-lg text-gray-800">Verify Payments</h3>
          <p className="text-gray-500 text-sm mt-1">Approve/Reject submissions</p>
        </Link>

        <Link to="/admin/messages" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group cursor-pointer text-left block">
          <div className="flex justify-between items-center mb-4">
            <div className="bg-indigo-50 p-3 rounded-full text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <HiOutlineMail size={24} />
            </div>
          </div>
          <h3 className="font-bold text-lg text-gray-800">User Messages</h3>
          <p className="text-gray-500 text-sm mt-1">View inquiries from Contact page</p>
        </Link>

      </div>
    </div>
  );
};

export default AdminDashboard;
