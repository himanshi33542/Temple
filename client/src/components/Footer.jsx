import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import API from '../api';

const Footer = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await API.get('/settings');
        setSettings(data);
      } catch (err) {
        console.error('Failed to fetch settings', err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-maroon-900 text-cream-100 pt-12 pb-8 border-t-4 border-gold-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="mb-8 md:mb-0">
            <h2 className="font-devanagari text-2xl text-gold-500 font-bold mb-4">{settings?.templeName || 'चारधाम मन्दिर'}</h2>
            <p className="text-sm opacity-80 leading-relaxed">
              {settings?.templeTagline || 'A sacred place for devotion, peace, and community. Join us in our daily prayers and upcoming festivals.'}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gold-500 mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-saffron-500 transition-colors">About Us</Link></li>
              <li><Link to="/aarti" className="hover:text-saffron-500 transition-colors">Aarti Schedule</Link></li>
              <li><Link to="/events" className="hover:text-saffron-500 transition-colors">Upcoming Events</Link></li>
              <li><Link to="/gallery" className="hover:text-saffron-500 transition-colors">Gallery</Link></li>
              <li><Link to="/donate" className="hover:text-saffron-500 transition-colors">Donations</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gold-500 mb-4">Contact Info</h3>
            <ul className="space-y-2 text-sm opacity-80">
              <li className="whitespace-pre-line">{settings?.contactAddress || 'Jhunjhunu, Rajasthan, India'}</li>
              <li>Phone: {settings?.contactPhone || '+91 98765 43210'}</li>
              <li>Email: {settings?.contactEmail || 'info@chardhammandir.com'}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gold-500 mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              {settings?.socialFacebook && (
                <a href={settings.socialFacebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-cream-100 text-maroon-900 flex items-center justify-center hover:bg-saffron-500 hover:text-white transition-colors">
                  <FaFacebookF />
                </a>
              )}
              {settings?.socialInstagram && (
                <a href={settings.socialInstagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-cream-100 text-maroon-900 flex items-center justify-center hover:bg-saffron-500 hover:text-white transition-colors">
                  <FaInstagram />
                </a>
              )}
              {settings?.socialTwitter && (
                <a href={settings.socialTwitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-cream-100 text-maroon-900 flex items-center justify-center hover:bg-saffron-500 hover:text-white transition-colors">
                  <FaTwitter />
                </a>
              )}
              {settings?.socialYoutube && (
                <a href={settings.socialYoutube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-cream-100 text-maroon-900 flex items-center justify-center hover:bg-saffron-500 hover:text-white transition-colors">
                  <FaYoutube />
                </a>
              )}
            </div>
          </div>

        </div>
        
        <div className="mt-12 pt-8 border-t border-maroon-800 text-center text-sm opacity-60 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} {settings?.footerCopyright || settings?.templeName || 'Chardham Mandir'}. All rights reserved.</p>
          <Link to="/admin/login" className="mt-4 md:mt-0 hover:text-gold-500 transition-colors">Admin Login</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
