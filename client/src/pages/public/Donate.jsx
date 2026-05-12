import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineBadgeCheck, HiOutlineUpload, HiOutlineOfficeBuilding, HiOutlineDownload, HiOutlineX, HiOutlinePrinter } from 'react-icons/hi';
import { FaQrcode } from 'react-icons/fa';
import toast from 'react-hot-toast';
import API from '../../api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Donate = () => {
  const [donationInfo, setDonationInfo] = useState(null);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const receiptRef = useRef(null);

  const handleDownload = async (donor) => {
    setSelectedDonation(donor);
    setDownloading(true);
    const toastId = toast.loading('Preparing Receipt...');
    
    // Wait for modal to open and content to render
    setTimeout(async () => {
      try {
        const element = receiptRef.current;
        if (!element) throw new Error('Receipt element not found');

        const canvas = await html2canvas(element, {
          scale: 3,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Receipt_${donor.name.replace(/\s+/g, '_')}.pdf`);
        
        toast.success('Receipt Downloaded!', { id: toastId });
      } catch (err) {
        console.error('PDF Error:', err);
        toast.error('Failed to generate PDF', { id: toastId });
      } finally {
        setDownloading(false);
        // We keep the modal open so they can see it, or close it?
        // User said "create model where detail is like reciept and that ss will get download pdf"
        // I'll keep it open for a bit then close? No, I'll let them close it manually.
      }
    }, 1000);
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    amount: '',
    transactionId: '',
  });
  const [screenshot, setScreenshot] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [infoRes, donorsRes] = await Promise.all([
          API.get('/donation/info'),
          API.get('/donations/approved')
        ]);
        setDonationInfo(infoRes.data);
        setDonors(donorsRes.data);
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setScreenshot(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!screenshot) return toast.error('Please upload a payment screenshot');
    
    setSubmitting(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    data.append('screenshot', screenshot);

    try {
      await API.post('/donations', data);
      toast.success('Request submitted, awaiting verification');
      setFormData({ name: '', email: '', phone: '', amount: '', transactionId: '' });
      setScreenshot(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-cream-50">Loading donation details...</div>;

  return (
    <div className="bg-cream-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-devanagari text-maroon-900 font-bold inline-block relative">
            Contribute (Seva)
            <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gold-500"></span>
          </h1>
          <p className="mt-8 text-gray-700 max-w-2xl mx-auto text-lg">
            Your generous contributions help us maintain the temple and serve the community.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto mb-20">
          
          {/* Left: Ways to Donate */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gold-200 relative overflow-hidden">
              <div className="flex items-center mb-6">
                <FaQrcode className="text-saffron-500 text-3xl mr-4" />
                <h2 className="text-2xl font-bold text-maroon-900">Scan & Pay (UPI)</h2>
              </div>
              
              <div className="bg-cream-50 p-6 rounded-xl border-2 border-dashed border-gold-400 flex flex-col items-center mb-6">
                <div className="w-48 h-48 bg-white border border-gray-200 p-2 rounded-lg shadow-sm mb-4">
                  <img src={donationInfo?.qrImageUrl || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${donationInfo?.upiId || 'temple@bank'}`} alt="UPI QR Code" />
                </div>
                <p className="font-mono text-lg font-bold text-gray-800 tracking-wider">{donationInfo?.upiId || 'templetrust@sbi'}</p>
              </div>
              <p className="text-sm text-gray-500 text-center">Supported Apps: GPay, PhonePe, Paytm, BHIM</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border border-cream-200">
              <div className="flex items-center mb-6">
                <HiOutlineOfficeBuilding className="text-maroon-800 text-3xl mr-4" />
                <h2 className="text-2xl font-bold text-maroon-900">Bank Transfer</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Account Name:</span>
                  <span>Chardham Mandir Trust</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Bank Name:</span>
                  <span>{donationInfo?.bankName || 'State Bank of India'}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Account Number:</span>
                  <span className="font-mono font-bold tracking-wider">{donationInfo?.accountNumber || '12345678901'}</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="font-semibold">IFSC Code:</span>
                  <span className="font-mono font-bold">{donationInfo?.ifscCode || 'SBIN0001234'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Submission Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gold-200">
            <h2 className="text-2xl font-bold text-maroon-900 mb-6">Inform Us After Payment</h2>
            <p className="text-md text-gray-600 mb-6">Once your payment is verified, your name will be added to the donor list. You can then download your receipt from there.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="name" placeholder="Full Name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-saffron-500" />
                <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-saffron-500" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="tel" name="phone" placeholder="Phone Number" required value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-saffron-500" />
                <input type="number" name="amount" placeholder="Amount Paid (₹)" required value={formData.amount} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-saffron-500" />
              </div>
              <input type="text" name="transactionId" placeholder="UPI Transaction ID / Ref No." required value={formData.transactionId} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-saffron-500" />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Payment Screenshot</label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-saffron-500 transition-colors">
                  <input type="file" required onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <HiOutlineUpload className="mx-auto text-3xl text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">{screenshot ? screenshot.name : 'Click to select or drag and drop image'}</p>
                </div>
              </div>

              <button type="submit" disabled={submitting} className="w-full py-4 bg-maroon-900 text-white font-bold rounded-xl hover:bg-maroon-800 transition-colors shadow-md disabled:opacity-50">
                {submitting ? 'Submitting...' : 'Submit Payment Details'}
              </button>
            </form>
          </div>
        </div>

        {/* Our Donors List */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-devanagari text-maroon-900 font-bold inline-block relative">
              Our Generous Donors
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gold-500"></span>
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-cream-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-maroon-900 text-white">
                  <tr>
                    <th className="px-6 py-4 font-bold">Donor Name</th>
                    <th className="px-6 py-4 font-bold">Amount</th>
                    <th className="px-6 py-4 font-bold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {donors.length > 0 ? donors.map((donor, idx) => (
                    <tr key={idx} className="hover:bg-cream-50 transition-colors">
                      <td className="px-6 py-4 font-medium flex items-center">
                        <HiOutlineBadgeCheck className="text-green-500 mr-2" /> {donor.name}
                      </td>
                      <td className="px-6 py-4 font-bold text-maroon-900">₹ {donor.amount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                          <span className="text-gray-500 text-sm mb-2 md:mb-0">{new Date(donor.createdAt).toLocaleDateString()}</span>
                          <button 
                            onClick={() => handleDownload(donor)}
                            disabled={downloading}
                            className="text-xs bg-gold-100 text-maroon-900 px-3 py-1 rounded-full font-bold hover:bg-gold-500 hover:text-white transition-all inline-flex items-center disabled:opacity-50"
                          >
                            <HiOutlineDownload className="mr-1" /> {downloading ? 'Downloading...' : 'Receipt'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-10 text-center text-gray-400 italic">No approved donors to display yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* Receipt Modal */}
      {selectedDonation && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in no-print">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => setSelectedDonation(null)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
            >
              <HiOutlineX size={24} />
            </button>

            <div id="receipt-modal-content" ref={receiptRef} className="bg-white border-t-8 border-saffron-600">
              {/* Receipt Header */}
              <div className="bg-cream-50 p-6 border-b flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="w-12 h-12 bg-saffron-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-3 shadow-inner">
                    ॐ
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-maroon-900 leading-tight">Chardham Mandir</h2>
                    <p className="text-[10px] text-gray-500 italic">Jhunjhunu, Rajasthan</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center text-green-600 bg-green-50 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-1">
                    <HiOutlineBadgeCheck className="mr-1" /> Verified
                  </div>
                  <p className="text-[10px] text-gray-400">No: {selectedDonation._id.substring(18).toUpperCase()}</p>
                </div>
              </div>

              {/* Receipt Body */}
              <div className="p-8 space-y-6">
                <div className="text-center">
                  <h3 className="text-sm font-bold text-gray-800 tracking-widest uppercase mb-1">Acknowledgement Receipt</h3>
                  <div className="w-12 h-0.5 bg-gold-400 mx-auto"></div>
                </div>

                <div className="grid grid-cols-2 gap-6 text-[11px]">
                  <div className="space-y-3 text-left">
                    <div>
                      <p className="text-gray-400 uppercase font-semibold tracking-tighter">Donor Name</p>
                      <p className="text-sm font-bold text-gray-800">{selectedDonation.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 uppercase font-semibold tracking-tighter">Phone</p>
                      <p className="font-medium text-gray-700">{selectedDonation.phone}</p>
                    </div>
                  </div>
                  <div className="space-y-3 text-right">
                    <div>
                      <p className="text-gray-400 uppercase font-semibold tracking-tighter">Date</p>
                      <p className="font-medium text-gray-700">{new Date(selectedDonation.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 uppercase font-semibold tracking-tighter">Transaction ID</p>
                      <p className="font-mono text-gray-700">{selectedDonation.transactionId}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-saffron-50 rounded-xl p-6 border border-saffron-100 flex justify-between items-center mt-6">
                  <span className="text-maroon-900 font-bold text-sm uppercase tracking-widest">Amount Paid</span>
                  <span className="text-2xl font-black text-maroon-900">₹ {selectedDonation.amount.toLocaleString('en-IN')}</span>
                </div>

                <p className="text-[10px] text-gray-400 text-center italic leading-relaxed pt-4">
                  "Your contribution helps maintain the holy shrine. May the Divine bless you."
                </p>

                <div className="flex justify-between items-end pt-8 border-t border-dashed">
                  <div className="text-left">
                    <p className="text-[8px] text-gray-400 uppercase font-bold">Generated On</p>
                    <p className="text-[8px] font-medium text-gray-500">{new Date().toLocaleString()}</p>
                  </div>
                  <div className="text-center opacity-40">
                    <div className="w-20 h-10 border-2 border-maroon-900/30 rounded flex items-center justify-center text-[8px] font-bold text-maroon-900/50 uppercase rotate-[-5deg]">
                      Digital Seal
                    </div>
                    <p className="mt-1 text-[7px] uppercase tracking-tighter">Authorized Signature</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t flex flex-col md:flex-row justify-center items-center space-y-3 md:space-y-0 md:space-x-3 no-print">
                <button 
                  onClick={() => handleDownload(selectedDonation)}
                  disabled={downloading}
                  className="flex items-center px-6 py-2 bg-maroon-900 text-white text-sm font-bold rounded-lg hover:bg-maroon-800 transition-colors disabled:opacity-50"
                >
                  <HiOutlineDownload className="mr-2" /> {downloading ? 'Downloading...' : 'Download PDF'}
                </button>
                <button 
                  onClick={() => window.print()}
                  className="flex items-center px-6 py-2 bg-white border-2 border-maroon-900 text-maroon-900 text-sm font-bold rounded-lg hover:bg-maroon-50 transition-colors"
                >
                  <HiOutlinePrinter className="mr-2" /> Print
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          /* Hide everything except the receipt */
          body * { 
            visibility: hidden !important; 
            overflow: visible !important;
          }
          .no-print, .no-print * { 
            display: none !important; 
          }
          #receipt-modal-content, #receipt-modal-content * { 
            visibility: visible !important; 
          }
          #receipt-modal-content {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 40px !important;
            background: white !important;
            z-index: 9999999 !important;
            visibility: visible !important;
            display: block !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Fix for flex/fixed parents */
          html, body {
            height: auto !important;
            overflow: visible !important;
          }
        }
      `}} />
    </div>
  );
};

export default Donate;
