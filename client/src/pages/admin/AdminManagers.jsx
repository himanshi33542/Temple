import { useState, useEffect } from 'react';
import API from '../../api';
import toast from 'react-hot-toast';
import { HiOutlineCloudUpload, HiOutlineTrash, HiOutlineSave, HiOutlinePlus, HiOutlineCheck, HiOutlineX, HiOutlineExternalLink, HiOutlineMail } from 'react-icons/hi';

// --- SETTINGS MANAGER ---
export const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('basic');
  const [settings, setSettings] = useState({
    templeName: '',
    templeTagline: '',
    aboutHistory: '',
    aboutMission: '',
    aboutValues: '',
    priestName: '',
    priestBio: '',
    contactAddress: '',
    contactPhone: '',
    contactEmail: '',
    contactTimings: '',
    contactMapIframe: '',
    footerCopyright: '',
    socialFacebook: '',
    socialInstagram: '',
    socialTwitter: '',
    socialYoutube: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [files, setFiles] = useState({ heroImage: null, priestImage: null, aboutHistoryImage: null });
  
  // Password change state
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await API.get('/settings');
        setSettings({
          templeName: data.templeName || '',
          templeTagline: data.templeTagline || '',
          aboutHistory: data.aboutHistory || '',
          aboutMission: data.aboutMission || '',
          aboutValues: data.aboutValues || '',
          priestName: data.priestName || '',
          priestBio: data.priestBio || '',
          contactAddress: data.contactAddress || '',
          contactPhone: data.contactPhone || '',
          contactEmail: data.contactEmail || '',
          contactTimings: data.contactTimings || '',
          contactMapIframe: data.contactMapIframe || '',
          footerCopyright: data.footerCopyright || '',
          socialFacebook: data.socialFacebook || '',
          socialInstagram: data.socialInstagram || '',
          socialTwitter: data.socialTwitter || '',
          socialYoutube: data.socialYoutube || '',
        });
      } catch (err) {
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData();
    Object.keys(settings).forEach(key => {
      const val = settings[key];
      // Only append if it's not null/undefined
      if (val !== null && val !== undefined) {
        formData.append(key, val);
      }
    });
    if (files.heroImage) formData.append('heroImage', files.heroImage);
    if (files.priestImage) formData.append('priestImage', files.priestImage);
    if (files.aboutHistoryImage) formData.append('aboutHistoryImage', files.aboutHistoryImage);

    try {
      await API.put('/settings', formData);
      toast.success('Settings updated successfully');
    } catch (err) {
      console.error('Update Error:', err);
      toast.error(err.response?.data?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setChangingPassword(true);
    try {
      await API.put('/auth/profile', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success('Password updated successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) return <div className="text-center py-10 font-bold">Loading settings...</div>;

  const tabs = [
    { id: 'basic', name: 'Basic Info' },
    { id: 'about', name: 'About Details' },
    { id: 'contact', name: 'Contact & Timings' },
    { id: 'footer', name: 'Footer & Social' },
    { id: 'security', name: 'Security' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      <div className="flex border-b">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 text-sm font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-saffron-50 text-saffron-700 border-b-2 border-saffron-500' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {activeTab === 'basic' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Temple Name</label>
                <input type="text" name="templeName" value={settings.templeName} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saffron-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Temple Tagline</label>
                <input type="text" name="templeTagline" value={settings.templeTagline} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saffron-500 outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Hero Banner Image</label>
                <input type="file" name="heroImage" onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-saffron-50 file:text-saffron-700 hover:file:bg-saffron-100" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Head Priest Name</label>
                <input type="text" name="priestName" value={settings.priestName} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saffron-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Priest Photo</label>
                <input type="file" name="priestImage" onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-saffron-50 file:text-saffron-700 hover:file:bg-saffron-100" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Priest Bio/Message</label>
              <textarea name="priestBio" value={settings.priestBio} onChange={handleChange} rows="4" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saffron-500 outline-none resize-none"></textarea>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">History Section Image</label>
              <input type="file" name="aboutHistoryImage" onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-saffron-50 file:text-saffron-700 hover:file:bg-saffron-100" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">History & Story</label>
              <textarea name="aboutHistory" value={settings.aboutHistory} onChange={handleChange} rows="6" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saffron-500 outline-none" placeholder="Detail the story and history of the temple..."></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Our Mission</label>
              <textarea name="aboutMission" value={settings.aboutMission} onChange={handleChange} rows="3" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saffron-500 outline-none" placeholder="What is the mission of this temple?"></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Our Values</label>
              <textarea name="aboutValues" value={settings.aboutValues} onChange={handleChange} rows="3" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saffron-500 outline-none" placeholder="List the core values (Devotion, Community, etc.)"></textarea>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Official Email</label>
                <input type="email" name="contactEmail" value={settings.contactEmail} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saffron-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number(s)</label>
                <input type="text" name="contactPhone" value={settings.contactPhone} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saffron-500 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Full Address</label>
              <textarea name="contactAddress" value={settings.contactAddress} onChange={handleChange} rows="2" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saffron-500 outline-none"></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Darshan/Temple Timings</label>
              <input type="text" name="contactTimings" value={settings.contactTimings} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saffron-500 outline-none" placeholder="e.g. 06:00 AM - 09:00 PM" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Google Maps Embed Link (URL inside src only)</label>
              <textarea name="contactMapIframe" value={settings.contactMapIframe} onChange={handleChange} rows="3" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saffron-500 outline-none" placeholder="Go to Google Maps > Share > Embed map > Copy ONLY the link inside src=''"></textarea>
              <p className="text-[10px] text-gray-400 mt-1 italic">Example: https://www.google.com/maps/embed?pb=...</p>
            </div>
          </div>
        )}

        {activeTab === 'footer' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Footer Copyright Text</label>
              <input type="text" name="footerCopyright" value={settings.footerCopyright} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saffron-500 outline-none" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Facebook URL</label>
                <input type="text" name="socialFacebook" value={settings.socialFacebook} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saffron-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Instagram URL</label>
                <input type="text" name="socialInstagram" value={settings.socialInstagram} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saffron-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Twitter/X URL</label>
                <input type="text" name="socialTwitter" value={settings.socialTwitter} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saffron-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">YouTube URL</label>
                <input type="text" name="socialYoutube" value={settings.socialYoutube} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saffron-500 outline-none" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6 animate-fadeIn max-w-md">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <p className="text-sm text-blue-700">
                Manage your administrative login credentials here.      
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
                <input 
                  type="password" 
                  name="currentPassword" 
                  value={passwordData.currentPassword} 
                  onChange={handlePasswordChange} 
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saffron-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                <input 
                  type="password" 
                  name="newPassword" 
                  value={passwordData.newPassword} 
                  onChange={handlePasswordChange} 
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saffron-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New Password</label>
                <input 
                  type="password" 
                  name="confirmPassword" 
                  value={passwordData.confirmPassword} 
                  onChange={handlePasswordChange} 
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saffron-500 outline-none" 
                />
              </div>
              <button
                type="button"
                onClick={handleUpdatePassword}
                disabled={changingPassword}
                className="w-full bg-maroon-900 text-white py-2 rounded-lg font-bold hover:bg-maroon-800 transition-colors flex items-center justify-center disabled:opacity-50"
              >
                {changingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>
        )}

        {activeTab !== 'security' && (
          <div className="pt-6 border-t flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-saffron-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-saffron-700 transition-all flex items-center shadow-lg disabled:opacity-50"
            >
              <HiOutlineSave className="mr-2" /> {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

// --- DONATIONS MANAGER ---
export const AdminDonations = () => {
  const [donation, setDonation] = useState({
    upiId: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [qrImage, setQrImage] = useState(null);

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        const { data } = await API.get(`/donation/info?t=${Date.now()}`);
        setDonation({
          upiId: data.upiId || '',
          bankName: data.bankName || '',
          accountNumber: data.accountNumber || '',
          ifscCode: data.ifscCode || '',
        });
      } catch (err) {
        toast.error('Failed to load donation info');
      } finally {
        setLoading(false);
      }
    };
    fetchDonation();
  }, []);

  const handleChange = (e) => {
    setDonation({ ...donation, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData();
    Object.keys(donation).forEach(key => formData.append(key, donation[key]));
    if (qrImage) formData.append('qrImage', qrImage);

    try {
      await API.put('/donation/info', formData);
      toast.success('Donation info updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update donation info');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading donation info...</div>;

  return (
    <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Donation Manager</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID</label>
            <input type="text" name="upiId" value={donation.upiId} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saffron-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
            <input type="text" name="bankName" value={donation.bankName} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saffron-500 outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
            <input type="text" name="accountNumber" value={donation.accountNumber} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saffron-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code</label>
            <input type="text" name="ifscCode" value={donation.ifscCode} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saffron-500 outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">UPI QR Code Image</label>
          <input type="file" onChange={(e) => setQrImage(e.target.files[0])} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-saffron-50 file:text-saffron-700 hover:file:bg-saffron-100" />
        </div>

        <button type="submit" disabled={saving} className="flex items-center justify-center px-6 py-3 bg-maroon-900 text-white font-bold rounded-lg hover:bg-maroon-800 transition-colors shadow-md disabled:opacity-50">
          <HiOutlineSave className="mr-2 text-xl" />
          {saving ? 'Updating...' : 'Update Donation Info'}
        </button>
      </form>
    </div>
  );
};

// --- AARTI MANAGER ---
export const AdminAarti = () => {
  const [aartis, setAartis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newAarti, setNewAarti] = useState({ name: '', time: '', session: 'Morning', priestName: '', order: 0 });

  const fetchAartis = async () => {
    try {
      const { data } = await API.get(`/aarti?t=${Date.now()}`);
      setAartis(data);
    } catch (err) {
      toast.error('Failed to load Aarti schedule');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAartis();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await API.post('/aarti', newAarti);
      toast.success('Aarti added');
      setNewAarti({ name: '', time: '', session: 'Morning', priestName: '', order: 0 });
      setShowAdd(false);
      fetchAartis();
    } catch (err) {
      toast.error('Failed to add Aarti');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this Aarti?')) return;
    try {
      await API.delete(`/aarti/${id}`);
      toast.success('Aarti deleted');
      fetchAartis();
    } catch (err) {
      toast.error('Failed to delete Aarti');
    }
  };

  if (loading) return <div className="text-center py-10">Loading Aarti schedule...</div>;

  return (
    <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Aarti Schedule Manager</h2>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center px-4 py-2 bg-saffron-500 text-white rounded-lg hover:bg-saffron-600 transition-colors">
          <HiOutlinePlus className="mr-2" /> {showAdd ? 'Cancel' : 'Add Aarti'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="mb-8 p-6 bg-cream-50 rounded-xl border border-gold-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Aarti Name" required value={newAarti.name} onChange={(e) => setNewAarti({...newAarti, name: e.target.value})} className="px-4 py-2 border rounded-lg" />
            <input type="text" placeholder="Time (e.g. 05:30 AM)" required value={newAarti.time} onChange={(e) => setNewAarti({...newAarti, time: e.target.value})} className="px-4 py-2 border rounded-lg" />
            <select value={newAarti.session} onChange={(e) => setNewAarti({...newAarti, session: e.target.value})} className="px-4 py-2 border rounded-lg">
              <option>Morning</option>
              <option>Afternoon</option>
              <option>Evening</option>
              <option>Night</option>
            </select>
            <input type="text" placeholder="Priest Name" value={newAarti.priestName} onChange={(e) => setNewAarti({...newAarti, priestName: e.target.value})} className="px-4 py-2 border rounded-lg" />
          </div>
          <button type="submit" className="w-full py-2 bg-maroon-900 text-white rounded-lg hover:bg-maroon-800">Save Aarti</button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-bold">Name</th>
              <th className="p-4 font-bold">Time</th>
              <th className="p-4 font-bold">Session</th>
              <th className="p-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {aartis.map((aarti) => (
              <tr key={aarti._id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium">{aarti.name}</td>
                <td className="p-4">{aarti.time}</td>
                <td className="p-4">{aarti.session}</td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(aarti._id)} className="text-red-500 hover:text-red-700">
                    <HiOutlineTrash size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- EVENTS MANAGER ---
export const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '', category: '', isPast: false });
  const [image, setImage] = useState(null);

  const fetchEvents = async () => {
    try {
      const { data } = await API.get(`/events?t=${Date.now()}`);
      setEvents(data);
    } catch (err) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(newEvent).forEach(key => formData.append(key, newEvent[key]));
    if (image) formData.append('image', image);

    try {
      await API.post('/events', formData);
      toast.success('Event added');
      setNewEvent({ title: '', description: '', date: '', category: '', isPast: false });
      setImage(null);
      setShowAdd(false);
      fetchEvents();
    } catch (err) {
      toast.error('Failed to add event');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await API.delete(`/events/${id}`);
      toast.success('Event deleted');
      fetchEvents();
    } catch (err) {
      toast.error('Failed to delete event');
    }
  };

  if (loading) return <div className="text-center py-10">Loading events...</div>;

  return (
    <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Events Manager</h2>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center px-4 py-2 bg-saffron-500 text-white rounded-lg hover:bg-saffron-600 transition-colors">
          <HiOutlinePlus className="mr-2" /> {showAdd ? 'Cancel' : 'Add Event'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="mb-8 p-6 bg-cream-50 rounded-xl border border-gold-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Title" required value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} className="px-4 py-2 border rounded-lg" />
            <input type="date" required value={newEvent.date} onChange={(e) => setNewEvent({...newEvent, date: e.target.value})} className="px-4 py-2 border rounded-lg" />
            <input type="text" placeholder="Category" value={newEvent.category} onChange={(e) => setNewEvent({...newEvent, category: e.target.value})} className="px-4 py-2 border rounded-lg" />
            <input type="file" onChange={(e) => setImage(e.target.files[0])} className="px-4 py-2" />
          </div>
          <textarea placeholder="Description" required value={newEvent.description} onChange={(e) => setNewEvent({...newEvent, description: e.target.value})} className="w-full px-4 py-2 border rounded-lg resize-none" rows="3"></textarea>
          <div className="flex items-center">
            <input type="checkbox" id="isPast" checked={newEvent.isPast} onChange={(e) => setNewEvent({...newEvent, isPast: e.target.checked})} className="mr-2" />
            <label htmlFor="isPast">Mark as Past Event</label>
          </div>
          <button type="submit" className="w-full py-2 bg-maroon-900 text-white rounded-lg hover:bg-maroon-800">Save Event</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => (
          <div key={event._id} className="flex bg-gray-50 rounded-xl overflow-hidden border">
            <div className="w-32 h-32 flex-shrink-0">
              <img src={event.image || 'https://via.placeholder.com/150'} alt={event.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg leading-tight">{event.title}</h3>
                <p className="text-xs text-gray-500">{new Date(event.date).toDateString()}</p>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${event.isPast ? 'bg-gray-200' : 'bg-green-100 text-green-700'}`}>
                  {event.isPast ? 'Past' : 'Upcoming'}
                </span>
                <button onClick={() => handleDelete(event._id)} className="text-red-500 hover:text-red-700">
                  <HiOutlineTrash size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- GALLERY MANAGER ---
export const AdminGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newPhoto, setNewPhoto] = useState({ category: 'Temple', caption: '' });
  const [files, setFiles] = useState([]);

  const fetchPhotos = async () => {
    try {
      const { data } = await API.get(`/gallery?t=${Date.now()}`);
      setPhotos(data);
    } catch (err) {
      toast.error('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (files.length === 0) return toast.error('Please select at least one image');
    
    setUploading(true);
    const formData = new FormData();
    // Append all files to the 'images' field
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }
    formData.append('category', newPhoto.category);
    formData.append('caption', newPhoto.caption);

    try {
      await API.post('/gallery', formData);
      toast.success(`${files.length} photo(s) uploaded`);
      setFiles([]);
      setNewPhoto({ category: 'Temple', caption: '' });
      fetchPhotos();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this photo?')) return;
    try {
      await API.delete(`/gallery/${id}`);
      toast.success('Photo deleted');
      fetchPhotos();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <div className="text-center py-10">Loading gallery...</div>;

  return (
    <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Gallery Manager</h2>
      
      <form onSubmit={handleUpload} className="mb-10 p-6 bg-cream-50 rounded-xl border border-gold-200">
        <h3 className="font-bold mb-4 flex items-center"><HiOutlineCloudUpload className="mr-2" /> Upload New Photo</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col">
            <input type="file" multiple required onChange={(e) => setFiles(e.target.files)} className="text-sm" />
            {files.length > 0 && <p className="text-xs text-saffron-600 mt-1 font-bold">{files.length} images selected</p>}
          </div>
          <select value={newPhoto.category} onChange={(e) => setNewPhoto({...newPhoto, category: e.target.value})} className="px-4 py-2 border rounded-lg">
            <option>Temple</option>
            <option>Festival</option>
            <option>Puja</option>
            <option>Community</option>
          </select>
          <input type="text" placeholder="Caption" value={newPhoto.caption} onChange={(e) => setNewPhoto({...newPhoto, caption: e.target.value})} className="px-4 py-2 border rounded-lg" />
        </div>
        <button type="submit" disabled={uploading} className="w-full py-2 bg-saffron-500 text-white rounded-lg hover:bg-saffron-600 disabled:opacity-50">
          {uploading ? 'Uploading...' : 'Upload to Gallery'}
        </button>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {photos.map((photo) => (
          <div key={photo._id} className="group relative rounded-lg overflow-hidden aspect-square border">
            <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button onClick={() => handleDelete(photo._id)} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                <HiOutlineTrash size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
// --- SHRINES MANAGER ---
export const AdminShrines = () => {
  const [shrines, setShrines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newShrine, setNewShrine] = useState({ name: '', deity: '', description: '', significance: '', order: 0 });
  const [image, setImage] = useState(null);

  const fetchShrines = async () => {
    try {
      const { data } = await API.get(`/shrines?t=${Date.now()}`);
      setShrines(data);
    } catch (err) {
      toast.error('Failed to load shrines');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShrines();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(newShrine).forEach(key => formData.append(key, newShrine[key]));
    if (image) formData.append('image', image);

    try {
      await API.post('/shrines', formData);
      toast.success('Shrine added');
      setNewShrine({ name: '', deity: '', description: '', significance: '', order: 0 });
      setImage(null);
      setShowAdd(false);
      fetchShrines();
    } catch (err) {
      toast.error('Failed to add shrine');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this shrine?')) return;
    try {
      await API.delete(`/shrines/${id}`);
      toast.success('Shrine deleted');
      fetchShrines();
    } catch (err) {
      toast.error('Failed to delete shrine');
    }
  };

  if (loading) return <div className="text-center py-10">Loading shrines...</div>;

  return (
    <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Shrines/Dhams Manager</h2>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center px-4 py-2 bg-saffron-500 text-white rounded-lg hover:bg-saffron-600 transition-colors">
          <HiOutlinePlus className="mr-2" /> {showAdd ? 'Cancel' : 'Add New Shrine'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="mb-8 p-6 bg-cream-50 rounded-xl border border-gold-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Shrine Name (e.g. Kedarnath Dham)" required value={newShrine.name} onChange={(e) => setNewShrine({...newShrine, name: e.target.value})} className="px-4 py-2 border rounded-lg" />
            <input type="text" placeholder="Deity (e.g. Lord Shiva)" value={newShrine.deity} onChange={(e) => setNewShrine({...newShrine, deity: e.target.value})} className="px-4 py-2 border rounded-lg" />
            <input type="number" placeholder="Order" value={newShrine.order} onChange={(e) => setNewShrine({...newShrine, order: e.target.value})} className="px-4 py-2 border rounded-lg" />
            <input type="file" onChange={(e) => setImage(e.target.files[0])} className="px-4 py-2" />
          </div>
          <textarea placeholder="Description" required value={newShrine.description} onChange={(e) => setNewShrine({...newShrine, description: e.target.value})} className="w-full px-4 py-2 border rounded-lg resize-none" rows="2"></textarea>
          <textarea placeholder="Significance/Symbolism" value={newShrine.significance} onChange={(e) => setNewShrine({...newShrine, significance: e.target.value})} className="w-full px-4 py-2 border rounded-lg resize-none" rows="2"></textarea>
          <button type="submit" className="w-full py-2 bg-maroon-900 text-white rounded-lg hover:bg-maroon-800">Save Shrine</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {shrines.map((shrine) => (
          <div key={shrine._id} className="flex bg-gray-50 rounded-xl overflow-hidden border">
            <div className="w-32 h-32 flex-shrink-0">
              <img src={shrine.imageUrl || 'https://via.placeholder.com/150'} alt={shrine.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-4 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg leading-tight">{shrine.name}</h3>
                <p className="text-sm text-saffron-700">{shrine.deity}</p>
              </div>
              <div className="flex justify-end items-center mt-2">
                <button onClick={() => handleDelete(shrine._id)} className="text-red-500 hover:text-red-700">
                  <HiOutlineTrash size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- DONATION RECORDS MANAGER ---
export const AdminDonationRecords = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  const fetchDonations = async () => {
    try {
      const { data } = await API.get(`/donations?status=${filter}&t=${Date.now()}`);
      setDonations(data);
    } catch (err) {
      toast.error('Failed to load donations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [filter]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await API.put(`/donations/${id}/status`, { status });
      toast.success(`Donation ${status}`);
      fetchDonations();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) return <div className="text-center py-10">Loading donation records...</div>;

  return (
    <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Donation Records</h2>
        <div className="flex space-x-2">
          <button onClick={() => setFilter('pending')} className={`px-4 py-2 rounded-lg transition-colors ${filter === 'pending' ? 'bg-saffron-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Pending</button>
          <button onClick={() => setFilter('approved')} className={`px-4 py-2 rounded-lg transition-colors ${filter === 'approved' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Approved</button>
          <button onClick={() => setFilter('rejected')} className={`px-4 py-2 rounded-lg transition-colors ${filter === 'rejected' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Rejected</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-y">
            <tr>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Donor Details</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Transaction ID</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Proof</th>
              <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {donations.map((donation) => (
              <tr key={donation._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-800">{donation.name}</div>
                  <div className="text-xs text-gray-500">{donation.phone}</div>
                  <div className="text-xs text-gray-500">{donation.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-bold text-maroon-900">₹ {donation.amount}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{donation.transactionId}</span>
                </td>
                <td className="px-6 py-4">
                  {donation.screenshot ? (
                    <a href={donation.screenshot} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline text-xs font-medium">
                      View Screenshot <HiOutlineExternalLink className="ml-1" />
                    </a>
                  ) : (
                    <span className="text-gray-400 text-xs italic">No screenshot</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    {donation.status !== 'approved' && (
                      <button onClick={() => handleStatusUpdate(donation._id, 'approved')} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-colors" title="Approve">
                        <HiOutlineCheck size={18} />
                      </button>
                    )}
                    {donation.status !== 'rejected' && (
                      <button onClick={() => handleStatusUpdate(donation._id, 'rejected')} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors" title="Reject">
                        <HiOutlineX size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {donations.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-gray-400 italic">No {filter} donations found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- MESSAGES MANAGER ---
export const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data } = await API.get(`/contact?t=${Date.now()}`);
      setMessages(data);
    } catch (err) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await API.delete(`/contact/${id}`);
      toast.success('Message deleted');
      fetchMessages();
    } catch (err) {
      toast.error('Failed to delete message');
    }
  };

  if (loading) return <div className="text-center py-10 font-bold">Loading messages...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Devotee Inquiries</h2>
        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold">
          {messages.length} Messages
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {messages.length === 0 ? (
          <div className="bg-white p-10 rounded-xl text-center border border-dashed text-gray-400">
            No messages yet.
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-maroon-900">{msg.name}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                    <span className="flex items-center"><HiOutlineMail className="mr-1" /> {msg.email}</span>
                    <span className="flex items-center"><HiOutlinePlus className="mr-1" /> {msg.phone}</span>
                    <span className="flex items-center text-gray-400 font-medium">Sent on: {new Date(msg.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(msg._id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <HiOutlineTrash size={20} />
                </button>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-xs font-bold text-indigo-600 uppercase mb-1">{msg.subject}</p>
                <p className="text-gray-700 whitespace-pre-line text-sm">{msg.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
