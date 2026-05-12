import DonationInfo from '../models/DonationInfo.js';
import cloudinary from '../utils/cloudinary.js';

// @desc    Get donation info
// @route   GET /api/donation/info
// @access  Public
export const getDonationInfo = async (req, res) => {
  try {
    const info = await DonationInfo.findOne();
    if (info) {
      res.json(info);
    } else {
      res.json({}); // Return empty if not set
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update donation info
// @route   PUT /api/donation/info
// @access  Private
export const updateDonationInfo = async (req, res) => {
  try {
    const { upiId, bankName, accountNumber, ifscCode } = req.body;
    let info = await DonationInfo.findOne();

    if (!info) {
      info = new DonationInfo({});
    }

    info.upiId = upiId || info.upiId;
    info.bankName = bankName || info.bankName;
    info.accountNumber = accountNumber || info.accountNumber;
    info.ifscCode = ifscCode || info.ifscCode;

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const uploadRes = await cloudinary.uploader.upload(dataURI, {
        folder: 'temple/donation',
      });
      info.qrImageUrl = uploadRes.secure_url;
    }

    const updatedInfo = await info.save();
    res.json(updatedInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
