import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../../api';

const Home = () => {
  const [settings, setSettings] = useState(null);
  const [nextAarti, setNextAarti] = useState(null);
  const [events, setEvents] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [settingsRes, aartiRes, eventsRes, galleryRes] = await Promise.all([
          API.get('/settings'),
          API.get('/aarti'),
          API.get('/events'),
          API.get('/gallery')
        ]);
        setSettings(settingsRes.data);
        setNextAarti(aartiRes.data[0]); // Just taking the first one as next for simplicity
        setEvents(eventsRes.data.slice(0, 3));
        setPhotos(galleryRes.data.slice(0, 6));
      } catch (err) {
        console.error('Failed to fetch home data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-cream-50">Loading divine experience...</div>;


  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={settings?.heroImageUrl || "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"} 
            alt="Temple Hero" 
            className="w-full h-full object-cover object-center filter brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-maroon-900/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-devanagari text-gold-500 font-bold mb-4 drop-shadow-lg"
          >
            {settings?.templeName || 'चारधाम मन्दिर'}
          </motion.h1>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl md:text-4xl text-cream-50 font-semibold mb-6 drop-shadow-md"
          >
            {settings?.templeName ? settings.templeName : 'Chardham Mandir'}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-cream-100 mb-10 max-w-2xl mx-auto italic"
          >
            "{settings?.templeTagline || 'Experience the essence of India’s four sacred pilgrimage sites in one divine space.'}"
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link 
              to="/aarti" 
              className="px-8 py-3 bg-saffron-500 text-white rounded-full font-bold text-lg hover:bg-saffron-600 transition-colors shadow-lg mr-4"
            >
              Live Aarti
            </Link>
            <Link 
              to="/donate" 
              className="px-8 py-3 bg-gold-500 text-maroon-900 rounded-full font-bold text-lg hover:bg-gold-600 transition-colors shadow-lg"
            >
              Donate Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Next Aarti Banner */}
      {/* <section className="bg-maroon-900 text-cream-50 py-4 border-b-4 border-gold-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-8">
          <div className="flex items-center space-x-3">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-saffron-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-saffron-500"></span>
            </span>
            <span className="font-semibold text-lg">Next Aarti: {nextAarti?.name || 'Mangala Aarti'}</span>
          </div>
          <div className="text-xl font-bold text-gold-400">
            {nextAarti?.time || '06:00 AM'}
          </div>
        </div>
      </section> */}

      {/* Events Section */}
      <section className="py-20 bg-cream-50 bg-mandala-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-devanagari text-maroon-900 font-bold inline-block relative">
              Upcoming Events
              <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gold-500"></span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.length > 0 ? events.map((event) => (
              <motion.div 
                key={event._id}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-cream-200"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={event.image || "https://images.unsplash.com/photo-1605332679904-1b918645228c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"} 
                    alt={event.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="text-saffron-600 font-bold text-sm mb-2">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  <h3 className="text-xl font-bold text-maroon-900 mb-3">{event.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
                  <Link to="/events" className="text-saffron-600 font-semibold hover:text-maroon-900 transition-colors">
                    Read More &rarr;
                  </Link>
                </div>
              </motion.div>
            )) : (
              <p className="col-span-3 text-center text-gray-500 italic">No upcoming events scheduled.</p>
            )}
          </div>
          <div className="text-center mt-10">
            <Link to="/events" className="inline-block px-6 py-2 border-2 border-saffron-500 text-saffron-600 font-semibold rounded-full hover:bg-saffron-500 hover:text-white transition-colors">
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-devanagari text-maroon-900 font-bold inline-block relative">
              Divine Gallery
              <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gold-500"></span>
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.length > 0 ? photos.map((photo, idx) => (
              <div key={photo._id || idx} className="group relative overflow-hidden rounded-lg aspect-square">
                <img 
                  src={photo.url} 
                  alt={photo.caption || `Gallery ${idx}`} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white border border-white px-4 py-2 rounded-full backdrop-blur-sm">View</span>
                </div>
              </div>
            )) : (
              <p className="col-span-3 text-center text-gray-500 italic">No photos available.</p>
            )}
          </div>
          <div className="text-center mt-10">
            <Link to="/gallery" className="inline-block px-6 py-2 border-2 border-gold-500 text-gold-600 font-semibold rounded-full hover:bg-gold-500 hover:text-white transition-colors">
              Explore Full Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* CTA / Donation Section */}
      <section className="py-24 bg-maroon-900 text-center relative overflow-hidden">
        {/* Background Mandala overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZmZmIj48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjgwIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==')] bg-repeat"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-devanagari text-gold-500 font-bold mb-6">Support the Temple</h2>
          <p className="text-xl text-cream-100 mb-10 opacity-90">
            Your generous contributions help us maintain the temple premises, conduct daily rituals, and support our community outreach programs.
          </p>
          <Link 
            to="/donate" 
            className="inline-block px-10 py-4 bg-gradient-to-r from-saffron-500 to-saffron-600 text-white font-bold text-xl rounded-full shadow-[0_0_20px_rgba(255,107,0,0.5)] hover:shadow-[0_0_30px_rgba(255,107,0,0.8)] transform hover:-translate-y-1 transition-all"
          >
            Make a Donation
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
