import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HiOutlineSearch, HiOutlinePrinter, HiOutlineDownload, HiOutlineBadgeCheck } from 'react-icons/hi';
import API from '../../api';
import toast from 'react-hot-toast';

const Receipt = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initialQuery = searchParams.get('query');
    if (initialQuery) {
      handleSearch(null, initialQuery);
    }
  }, []);

  const handleSearch = async (e, directQuery = null) => {
    if (e) e.preventDefault();
    const searchTerm = directQuery || query;
    if (!searchTerm) return;
    
    setLoading(true);
    try {
      const { data } = await API.get(`/donations/search?query=${searchTerm}`);
      setDonation(data);
    } catch (err) {
      if (!directQuery) toast.error(err.response?.data?.message || 'No approved donation found');
      setDonation(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-cream-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search Header */}
        <div className="text-center mb-12 no-print">
          <h1 className="text-4xl font-devanagari text-maroon-900 font-bold mb-4">Download Donation Receipt</h1>
          <p className="text-gray-600 mb-8">Search for your verified donation using your Name or UPI Transaction ID.</p>
          
          <form onSubmit={handleSearch} className="flex max-w-lg mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-gold-200">
            <input 
              type="text" 
              placeholder="Enter Name or Transaction ID..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-grow px-6 py-4 outline-none"
            />
            <button type="submit" disabled={loading} className="bg-maroon-900 text-white px-8 py-4 hover:bg-maroon-800 transition-colors flex items-center">
              {loading ? 'Searching...' : <><HiOutlineSearch className="mr-2 text-xl" /> Search</>}
            </button>
          </form>
        </div>

        {/* Receipt Display */}
        {donation && (
          <div className="animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-t-8 border-saffron-600 print:shadow-none print:border-none" id="receipt-content">
              {/* Receipt Header */}
              <div className="bg-cream-50 p-8 border-b flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="w-16 h-16 bg-saffron-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mr-4 shadow-inner">
                    ॐ
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-maroon-900">Chardham Mandir</h2>
                    <p className="text-sm text-gray-500 italic">Jhunjhunu, Rajasthan</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                    <HiOutlineBadgeCheck className="mr-1 text-lg" /> Verified Donation
                  </div>
                  <p className="text-xs text-gray-400">Receipt No: {donation._id.substring(18).toUpperCase()}</p>
                </div>
              </div>

              {/* Receipt Body */}
              <div className="p-8 md:p-12 space-y-8">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">ACKNOWLEDGEMENT RECEIPT</h3>
                  <div className="w-20 h-1 bg-gold-400 mx-auto"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-400 uppercase font-semibold text-xs tracking-widest">Donor Name</p>
                      <p className="text-lg font-bold text-gray-800">{donation.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 uppercase font-semibold text-xs tracking-widest">Phone Number</p>
                      <p className="font-medium text-gray-700">{donation.phone}</p>
                    </div>
                  </div>
                  <div className="space-y-4 text-right md:text-left">
                    <div>
                      <p className="text-gray-400 uppercase font-semibold text-xs tracking-widest">Transaction Date</p>
                      <p className="font-medium text-gray-700">{new Date(donation.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 uppercase font-semibold text-xs tracking-widest">Transaction ID</p>
                      <p className="font-mono text-gray-700">{donation.transactionId}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-saffron-50 rounded-xl p-8 border border-saffron-100 flex justify-between items-center mt-12">
                  <span className="text-maroon-900 font-bold text-lg uppercase tracking-widest">Total Amount Paid</span>
                  <span className="text-3xl font-black text-maroon-900">₹ {donation.amount.toLocaleString('en-IN')}</span>
                </div>

                <div className="pt-8 text-center text-xs text-gray-400 leading-relaxed max-w-md mx-auto italic">
                  "Your generous contribution helps in maintaining the holy shrine and supporting our community initiatives. May the blessings of the Divine be with you."
                </div>

                <div className="flex justify-between items-end pt-12 border-t border-dashed">
                  <div className="text-left">
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Generated On</p>
                    <p className="text-[10px] font-medium text-gray-500">{new Date().toLocaleString()}</p>
                  </div>
                  <div className="text-center opacity-40">
                    <div className="w-24 h-12 border-2 border-maroon-900/30 rounded flex items-center justify-center text-[10px] font-bold text-maroon-900/50 uppercase rotate-[-5deg]">
                      Digital Seal
                    </div>
                    <p className="mt-1 text-[8px] uppercase tracking-tighter">Authorized Signature</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Receipt Actions */}
            <div className="mt-8 flex justify-center space-x-4 no-print">
              <button 
                onClick={handlePrint}
                className="flex items-center px-6 py-3 bg-white border-2 border-maroon-900 text-maroon-900 font-bold rounded-xl hover:bg-maroon-50 transition-colors"
              >
                <HiOutlinePrinter className="mr-2 text-xl" /> Print Receipt
              </button>
              <button 
                onClick={handlePrint}
                className="flex items-center px-6 py-3 bg-maroon-900 text-white font-bold rounded-xl hover:bg-maroon-800 transition-colors shadow-lg"
              >
                <HiOutlineDownload className="mr-2 text-xl" /> Download PDF
              </button>
            </div>
          </div>
        )}

        {/* Print Styles */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            .no-print { display: none !important; }
            body { background: white !important; }
            .bg-cream-50 { background-color: transparent !important; }
            .shadow-2xl { box-shadow: none !important; }
            .rounded-2xl { border-radius: 0 !important; }
            #receipt-content { border: 1px solid #eee !important; margin: 0 !important; width: 100% !important; }
          }
        `}} />

      </div>
    </div>
  );
};

export default Receipt;
