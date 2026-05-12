import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineCalendar, HiOutlineLocationMarker, HiX } from 'react-icons/hi';
import API from '../../api';

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await API.get('/events');
        setEvents(data);
      } catch (err) {
        console.error('Failed to fetch events', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-cream-50">Loading divine events...</div>;


  const upcomingEvents = events.filter(e => !e.isPast).sort((a, b) => new Date(a.date) - new Date(b.date));
  const pastEvents = events.filter(e => e.isPast).sort((a, b) => new Date(b.date) - new Date(a.date));

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-cream-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-devanagari text-maroon-900 font-bold inline-block relative">
            Temple Events
            <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gold-500"></span>
          </h1>
        </div>

        {/* Upcoming Events */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-maroon-900 mb-8 border-l-4 border-saffron-500 pl-4">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map(event => (
              <motion.div 
                key={event._id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-cream-200 cursor-pointer flex flex-col"
                onClick={() => setSelectedEvent(event)}
              >
                <div className="h-56 relative">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-bold text-saffron-600 shadow">
                    {event.category}
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex items-center text-saffron-600 mb-3 text-sm font-bold">
                    <HiOutlineCalendar className="mr-2" size={20} />
                    {formatDate(event.date)}
                  </div>
                  <h3 className="text-2xl font-bold text-maroon-900 mb-3">{event.title}</h3>
                  <p className="text-gray-600 line-clamp-3 mb-4 flex-grow">{event.description}</p>
                  <button className="text-saffron-600 font-bold hover:text-maroon-900 transition-colors self-start mt-auto">
                    View Details &rarr;
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Past Events */}
        <div>
          <h2 className="text-3xl font-bold text-gray-700 mb-8 border-l-4 border-gray-400 pl-4">Past Events</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 divide-y divide-gray-100">
            {pastEvents.map(event => (
              <div key={event._id} className="p-6 flex flex-col md:flex-row items-center gap-6 hover:bg-gray-50 transition-colors">
                <div className="w-full md:w-32 flex-shrink-0 text-center md:text-left">
                  <div className="text-gray-500 font-bold">{formatDate(event.date)}</div>
                </div>
                <div className="flex-grow text-center md:text-left">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{event.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-1">{event.description}</p>
                </div>
                <div>
                  <button 
                    onClick={() => setSelectedEvent(event)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 font-medium text-sm transition-colors"
                  >
                    View Gallery
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Event Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative h-64">
                <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-full object-cover" />
                <button 
                  className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white text-maroon-900 transition-colors"
                  onClick={() => setSelectedEvent(null)}
                >
                  <HiX size={24} />
                </button>
              </div>
              <div className="p-8">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="px-3 py-1 bg-saffron-100 text-saffron-700 rounded-full text-sm font-bold">
                    {selectedEvent.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${selectedEvent.isPast ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'}`}>
                    {selectedEvent.isPast ? 'Completed' : 'Upcoming'}
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-maroon-900 mb-6">{selectedEvent.title}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-cream-50 p-4 rounded-xl border border-cream-200">
                  <div className="flex items-center text-maroon-800">
                    <HiOutlineCalendar className="mr-3 text-gold-500" size={24} />
                    <span className="font-semibold">{formatDate(selectedEvent.date)}</span>
                  </div>
                  <div className="flex items-center text-maroon-800">
                    <HiOutlineLocationMarker className="mr-3 text-gold-500" size={24} />
                    <span className="font-semibold">Main Temple Hall</span>
                  </div>
                </div>

                <div className="prose max-w-none text-gray-700">
                  <p>{selectedEvent.description}</p>
                </div>
                
                {!selectedEvent.isPast && (
                  <div className="mt-8 flex justify-end">
                    <button className="px-8 py-3 bg-saffron-500 text-white font-bold rounded-lg hover:bg-saffron-600 transition-colors shadow-md">
                      Set Reminder
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Events;
