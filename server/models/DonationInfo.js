import mongoose from 'mongoose';

const donationInfoSchema = new mongoose.Schema({
  qrImageUrl: {
    type: String,
  },
  upiId: {
    type: String,
  },
  bankName: {
    type: String,
  },
  accountNumber: {
    type: String,
  },
  ifscCode: {
    type: String,
  },
}, { timestamps: true });

const DonationInfo = mongoose.model('DonationInfo', donationInfoSchema);
export default DonationInfo;
