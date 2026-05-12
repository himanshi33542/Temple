import { motion } from 'framer-motion';
import { HiOutlineDocumentDownload } from 'react-icons/hi';

const Trust = () => {
  const committee = [
    { name: 'Shri Ramdas', role: 'President', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
    { name: 'Smt. Saraswati Devi', role: 'Vice President', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
    { name: 'Shri K.N. Sharma', role: 'Secretary', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
    { name: 'Shri Bharat Patel', role: 'Treasurer', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
  ];

  return (
    <div className="bg-cream-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-devanagari text-maroon-900 font-bold inline-block relative">
            Temple Trust
            <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gold-500"></span>
          </h1>
          <p className="mt-8 text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Shri Ram Mandir Trust is a registered non-profit organization dedicated to the maintenance of the temple and the upliftment of the community through spiritual and social initiatives.
          </p>
        </div>

        {/* Committee Members */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-maroon-900 mb-10 text-center">Managing Committee</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {committee.map((member, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg border border-cream-200 overflow-hidden text-center group"
              >
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute inset-0 bg-maroon-900/20 group-hover:bg-transparent transition-colors z-10"></div>
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-maroon-900 mb-1">{member.name}</h3>
                  <p className="text-saffron-600 font-medium">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Legal & Documents */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gold-200 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-gold-50 rounded-full z-0"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-maroon-900 mb-8">Trust Details & Documents</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div className="flex border-b border-gray-100 pb-3">
                  <span className="w-1/3 text-gray-500 font-medium">Trust Name</span>
                  <span className="w-2/3 text-maroon-900 font-bold">Shri Ram Mandir Charitable Trust</span>
                </div>
                <div className="flex border-b border-gray-100 pb-3">
                  <span className="w-1/3 text-gray-500 font-medium">Registration No.</span>
                  <span className="w-2/3 text-gray-800">E/12345/CITY</span>
                </div>
                <div className="flex border-b border-gray-100 pb-3">
                  <span className="w-1/3 text-gray-500 font-medium">80G Reg No.</span>
                  <span className="w-2/3 text-gray-800">CIT/EXEMPTION/80G/2020-21/123</span>
                </div>
                <div className="flex border-b border-gray-100 pb-3">
                  <span className="w-1/3 text-gray-500 font-medium">FCRA Reg No.</span>
                  <span className="w-2/3 text-gray-800">098765432</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Public Documents</h3>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="flex items-center p-3 rounded-lg bg-cream-50 hover:bg-saffron-50 text-maroon-800 hover:text-saffron-700 transition-colors border border-transparent hover:border-saffron-200">
                      <HiOutlineDocumentDownload className="mr-3 text-2xl" />
                      <div>
                        <div className="font-semibold text-sm">Trust Deed.pdf</div>
                        <div className="text-xs text-gray-500">2.4 MB</div>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center p-3 rounded-lg bg-cream-50 hover:bg-saffron-50 text-maroon-800 hover:text-saffron-700 transition-colors border border-transparent hover:border-saffron-200">
                      <HiOutlineDocumentDownload className="mr-3 text-2xl" />
                      <div>
                        <div className="font-semibold text-sm">Annual Report 2024-25.pdf</div>
                        <div className="text-xs text-gray-500">5.1 MB</div>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center p-3 rounded-lg bg-cream-50 hover:bg-saffron-50 text-maroon-800 hover:text-saffron-700 transition-colors border border-transparent hover:border-saffron-200">
                      <HiOutlineDocumentDownload className="mr-3 text-2xl" />
                      <div>
                        <div className="font-semibold text-sm">Audited Financials.pdf</div>
                        <div className="text-xs text-gray-500">1.8 MB</div>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Trust;
