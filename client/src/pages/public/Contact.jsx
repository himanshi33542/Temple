import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineLocationMarker, HiOutlinePhone, HiOutlineMail } from 'react-icons/hi';
import toast from 'react-hot-toast';
import API from '../../api';

const Contact = () => {
  const [settings, setSettings] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await API.post('/contact', formData);
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cream-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-devanagari text-maroon-900 font-bold inline-block relative">
            Contact Us
            <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gold-500"></span>
          </h1>
          <p className="mt-8 text-gray-700 max-w-2xl mx-auto">
            Have questions about temple timings, special pujas, or donations? Feel free to reach out to us.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-md p-8 border border-cream-200"
            >
              <div className="flex items-start mb-6">
                <div className="bg-saffron-100 p-3 rounded-full mr-4">
                  <HiOutlineLocationMarker className="text-saffron-600 text-2xl" />
                </div>
                <div>
                  <h3 className="font-bold text-maroon-900 text-xl mb-2">Temple Address</h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {settings?.contactAddress || 'Jhunjhunu, Rajasthan, India'}
                  </p>
                </div>
              </div>

              <div className="flex items-start mb-6">
                <div className="bg-saffron-100 p-3 rounded-full mr-4">
                  <HiOutlinePhone className="text-saffron-600 text-2xl" />
                </div>
                <div>
                  <h3 className="font-bold text-maroon-900 text-xl mb-2">Phone</h3>
                  <p className="text-gray-600">
                    {settings?.contactPhone || '+91 98765 43210'}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-saffron-100 p-3 rounded-full mr-4">
                  <HiOutlineMail className="text-saffron-600 text-2xl" />
                </div>
                <div>
                  <h3 className="font-bold text-maroon-900 text-xl mb-2">Email</h3>
                  <p className="text-gray-600">
                    {settings?.contactEmail || 'info@chardhammandir.com'}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Temple Timings */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-maroon-900 text-cream-50 rounded-2xl shadow-md p-8 border-b-4 border-gold-500"
            >
              <h3 className="font-devanagari font-bold text-2xl text-gold-500 mb-6">Darshan Timings</h3>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-maroon-800 pb-2">
                  <span>General Timings</span>
                  <span className="font-bold">{settings?.contactTimings || '06:00 AM - 09:00 PM'}</span>
                </div>
                <div className="mt-6 pt-2">
                  <p className="text-sm opacity-80 italic text-center">
                    *Timings may vary during special festivals or rituals
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Contact Form & Map */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-md p-8 border border-cream-200"
            >
              <h3 className="text-2xl font-bold text-maroon-900 mb-6">Send us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-saffron-500 focus:border-transparent outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-saffron-500 focus:border-transparent outline-none transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-saffron-500 focus:border-transparent outline-none transition-all"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <input 
                      type="text" 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-saffron-500 focus:border-transparent outline-none transition-all"
                      placeholder="How can we help?"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                  <textarea 
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-saffron-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Write your message here..."
                  ></textarea>
                </div>

                <div>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className={`w-full py-4 bg-saffron-600 text-white font-bold rounded-lg hover:bg-saffron-700 transition-colors shadow-md ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Map Embed */}
            <div className="bg-gray-200 rounded-2xl h-80 overflow-hidden shadow-inner relative border-2 border-white">
              {settings?.contactMapIframe ? (
                <iframe 
                  src={settings.contactMapIframe} 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy"
                  title="Temple Location"
                ></iframe> 
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-300 text-gray-500">
                  <p className="font-bold">Google Maps Embed Ready</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
