import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import API from '../../api';

const About = () => {
  const [settings, setSettings] = useState(null);
  const [shrines, setShrines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, shrinesRes] = await Promise.all([
          API.get('/settings'),
          API.get('/shrines')
        ]);
        setSettings(settingsRes.data);
        setShrines(shrinesRes.data);
      } catch (err) {
        console.error('Failed to fetch about data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-cream-50">Loading...</div>;

  return (
    <div className="bg-cream-50 pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-devanagari text-maroon-900 font-bold inline-block relative"
          >
            About The Temple
            <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gold-500"></span>
          </motion.h1>
        </div>

        {/* History & Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gold-500 rounded-2xl transform translate-x-4 translate-y-4"></div>
            <img 
              src={settings?.aboutHistoryImageUrl || "https://images.unsplash.com/photo-1582652614983-05908233df01?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
              alt="Temple History" 
              className="relative z-10 rounded-2xl shadow-xl w-full h-[400px] object-cover"
            />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-maroon-900 mb-6 font-devanagari">A Spiritual Oasis in Jhunjhunu</h2>
            <div className="text-gray-700 text-lg mb-6 leading-relaxed whitespace-pre-line">
              {settings?.aboutHistory || `Chardham Mandir in Jhunjhunu is a spiritually inspired temple designed to bring together the essence of India’s four sacred pilgrimage sites — Badrinath, Kedarnath, Gangotri, and Yamunotri — into one divine space.

              Built in traditional Rajasthani style with marble craftsmanship, the temple offers devotees an opportunity to experience the spiritual significance of the Char Dham Yatra without traveling to the Himalayas.`}
            </div>
            <div className="flex space-x-4">
              <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-saffron-500">
                <div className="font-bold text-2xl text-maroon-900">Devotional</div>
                <div className="text-sm text-gray-500">Concept</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-gold-500">
                <div className="font-bold text-2xl text-maroon-900">Marble</div>
                <div className="text-sm text-gray-500">Architecture</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Priest Profile */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-cream-200 mb-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-saffron-100 rounded-bl-full -z-10 opacity-50"></div>
          
          <div className="text-center mb-10">
            <h2 className="text-3xl font-devanagari text-maroon-900 font-bold inline-block relative">
              Head Priest
              <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-saffron-500"></span>
            </h2>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-shrink-0">
              <div className="w-48 h-48 rounded-full border-4 border-gold-500 overflow-hidden shadow-lg mx-auto">
                <img 
                   src={settings?.priestImageUrl || "https://images.unsplash.com/photo-1542868727-4638d2f09ba1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"} 
                   alt="Head Priest" 
                   className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-maroon-900 mb-2">{settings?.priestName || 'Acharya Shastri Ji'}</h3>
              <p className="text-saffron-600 font-medium mb-4">Chief Priest & Spiritual Guide</p>
              <p className="text-gray-700 leading-relaxed italic">
                "{settings?.priestBio || 'This temple is inspired by the sacred Char Dham pilgrimage of India and aims to provide a similar spiritual experience within Jhunjhunu.'}"
              </p>
            </div>
          </div>
        </div>

        {/* Mission & Values */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-devanagari text-maroon-900 font-bold inline-block relative">
            Our Mission & Values
            <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gold-500"></span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Devotion', desc: settings?.aboutMission || 'Fostering deep, unconditional love and surrender to the divine.' },
            { title: 'Community', desc: settings?.aboutValues || 'Building a supportive, inclusive family united by faith and dharma.' },
            { title: 'Service (Seva)', desc: 'Selfless service to humanity as a path to spiritual realization.' },
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="bg-maroon-900 text-cream-50 rounded-2xl p-8 text-center shadow-lg border-b-4 border-gold-500"
            >
              <div className="w-16 h-16 mx-auto bg-gold-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <span className="text-2xl">🕉️</span>
              </div>
              <h3 className="text-xl font-bold text-gold-400 mb-4">{item.title}</h3>
              <p className="opacity-90">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Shrines / 4 Dham Section */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-devanagari text-maroon-900 font-bold inline-block relative">
              The Shrines of Chardham
              <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-saffron-500"></span>
            </h2>
            <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
              Explore the divine presence of our sacred shrines, each reflecting the spiritual energy of India's most holy sites.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {shrines && shrines.length > 0 ? (
              shrines.map((shrine) => (
                <motion.div 
                  key={shrine._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg border border-cream-200 flex flex-col sm:flex-row"
                >
                  <div className="sm:w-1/3 h-48 sm:h-auto">
                    <img src={shrine.imageUrl || "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} alt={shrine.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6 sm:w-2/3">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-maroon-900">{shrine.name}</h3>
                      <span className="px-2 py-1 bg-saffron-100 text-saffron-700 text-xs font-bold rounded uppercase tracking-wider">{shrine.deity}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{shrine.description}</p>
                    {shrine.significance && (
                      <div className="bg-cream-50 p-3 rounded-lg border-l-4 border-gold-500">
                        <p className="text-xs text-maroon-800 italic">"{shrine.significance}"</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              // Default/Fallback Shrines if none in DB
              ['Kedarnath Dham', 'Badrinath Dham', 'Gangotri Dham', 'Yamunotri Dham'].map((name, i) => (
                <div key={i} className="bg-white rounded-2xl p-8 shadow-md border border-cream-200 opacity-60">
                  <h3 className="text-xl font-bold text-gray-400">{name}</h3>
                  <p className="text-gray-400 text-sm mt-2 italic">Details coming soon...</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
