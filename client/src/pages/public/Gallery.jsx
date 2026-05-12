import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import API from '../../api';

const Gallery = () => {
  const [filter, setFilter] = useState('All');
  const [selectedImg, setSelectedImg] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const { data } = await API.get('/gallery');
        setPhotos(data);
      } catch (err) {
        console.error('Failed to fetch photos', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-cream-50">Loading gallery...</div>;


  const categories = ['All', 'Temple', 'Festival', 'Puja', 'Community'];

  const filteredPhotos = filter === 'All' ? photos : photos.filter(img => img.category === filter);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setSelectedImg(filteredPhotos[index]);
  };

  const closeLightbox = () => {
    setSelectedImg(null);
  };

  const nextImg = (e) => {
    e.stopPropagation();
    const nextIndex = (currentIndex + 1) % filteredPhotos.length;
    setCurrentIndex(nextIndex);
    setSelectedImg(filteredPhotos[nextIndex]);
  };

  const prevImg = (e) => {
    e.stopPropagation();
    const prevIndex = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    setCurrentIndex(prevIndex);
    setSelectedImg(filteredPhotos[prevIndex]);
  };

  return (
    <div className="bg-cream-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-devanagari text-maroon-900 font-bold inline-block relative">
            Divine Gallery
            <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gold-500"></span>
          </h1>
          <p className="mt-8 text-gray-600 max-w-2xl mx-auto">
            Explore the beautiful moments captured within the temple premises during various festivals, pujas, and everyday devotion.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full font-semibold transition-all shadow-sm ${
                filter === cat 
                  ? 'bg-saffron-500 text-white shadow-md' 
                  : 'bg-white text-maroon-900 border border-cream-200 hover:border-saffron-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Grid Simulation */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredPhotos.map((photo, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={photo._id}
                className="group relative cursor-pointer overflow-hidden rounded-xl shadow-md border-2 border-transparent hover:border-gold-400 aspect-square"
                onClick={() => openLightbox(index)}
              >
                <img 
                  src={photo.url} 
                  alt={photo.caption} 
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-maroon-900/90 via-maroon-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-white font-bold text-lg">{photo.caption}</h3>
                  <p className="text-gold-400 text-sm">{photo.category}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
            onClick={closeLightbox}
          >
            <button 
              className="absolute top-4 right-4 text-white hover:text-gold-500 focus:outline-none"
              onClick={closeLightbox}
            >
              <HiX size={40} />
            </button>

            <button 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gold-500 focus:outline-none"
              onClick={prevImg}
            >
              <HiChevronLeft size={50} />
            </button>

            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="max-w-5xl max-h-[80vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedImg.url} 
                alt={selectedImg.caption} 
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
              />
              <div className="text-center mt-4 text-white">
                <h3 className="text-xl font-bold">{selectedImg.caption}</h3>
                <p className="text-gold-400">{selectedImg.category}</p>
              </div>
            </motion.div>

            <button 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gold-500 focus:outline-none"
              onClick={nextImg}
            >
              <HiChevronRight size={50} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
