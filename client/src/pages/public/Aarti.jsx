import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineClock, HiOutlineUser } from 'react-icons/hi';
import API from '../../api';

const Aarti = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const { data } = await API.get('/aarti');
        setSchedule(data);
      } catch (err) {
        console.error('Failed to fetch aarti schedule', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-cream-50">Loading divine schedule...</div>;


  return (
    <div className="bg-cream-50 min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-devanagari text-maroon-900 font-bold inline-block relative">
            Aarti Schedule
            <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-saffron-500"></span>
          </h1>
          <p className="mt-8 text-gray-600">Join us in our daily prayers and experience divine peace.</p>
        </div>

        {/* Live Countdown Banner (Dummy) */}
        {/* <div className="bg-gradient-to-r from-maroon-900 to-maroon-800 rounded-2xl p-6 md:p-10 text-white shadow-xl mb-16 relative overflow-hidden border-2 border-gold-500">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[url('/mandala-bg.svg')] opacity-10 -mr-10 -mt-10 animate-spin-slow"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between text-center md:text-left">
            <div>
              <div className="text-saffron-400 font-bold uppercase tracking-wider text-sm mb-2">Live Streaming Available</div>
              <h2 className="text-3xl font-devanagari font-bold mb-2">Next: Sandhya Aarti</h2>
              <p className="opacity-80">Join us online or at the temple premises</p>
            </div>
            <div className="mt-6 md:mt-0 bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="text-sm text-gold-400 mb-1">Time Remaining</div>
              <div className="text-4xl font-mono font-bold tracking-widest">
                02:14:45
              </div>
            </div>
          </div>
        </div> */}

        {/* Schedule List */}
        <div className="space-y-6">
          {schedule.map((item, index) => (
            <motion.div 
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md border-l-8 border-saffron-500 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-maroon-900">{item.name}</h3>
                    <span className="px-3 py-1 bg-cream-100 text-maroon-800 text-xs font-bold rounded-full">
                      {item.session}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{item.desc}</p>
                  <div className="flex items-center text-sm text-gray-500 font-medium">
                    <HiOutlineUser className="mr-1 text-saffron-600" size={18} />
                    Priest: {item.priestName}
                  </div>
                </div>
                
                <div className="flex-shrink-0 bg-cream-50 p-4 rounded-lg border border-gold-200 text-center min-w-[150px]">
                  <HiOutlineClock className="mx-auto mb-2 text-saffron-600" size={32} />
                  <div className="text-xl font-bold text-maroon-900">{item.time}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Aarti;
