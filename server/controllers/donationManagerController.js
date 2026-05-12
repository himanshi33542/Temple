import Donation from '../models/Donation.js';
import cloudinary from '../utils/cloudinary.js';

// @desc    Submit a new donation request
// @route   POST /api/donations
// @access  Public
export const submitDonation = async (req, res) => {
  try {
    const { name, email, phone, amount, transactionId } = req.body;
    let screenshot = '';

    // Check if transaction ID already exists
    const existing = await Donation.findOne({ transactionId });
    if (existing) {
      return res.status(400).json({ message: 'Transaction ID already submitted' });
    }

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const uploadRes = await cloudinary.uploader.upload(dataURI, {
        folder: 'temple/donations',
      });
      screenshot = uploadRes.secure_url;
    }

    const donation = await Donation.create({
      name, email, phone, amount, transactionId, screenshot
    });

    res.status(201).json({ message: 'Request submitted, awaiting verification', donation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get donations by status
// @route   GET /api/donations
// @access  Private (Admin)
export const getDonations = async (req, res) => {
  try {
    const status = req.query.status || 'pending';
    const donations = await Donation.find({ status }).sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve/Reject donation
// @route   PUT /api/donations/:id/status
// @access  Private (Admin)
export const updateDonationStatus = async (req, res) => {
  try {
    const { status } = req.body; // approved or rejected
    const donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    donation.status = status;
    await donation.save();

    res.json({ message: `Donation ${status}`, donation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get approved donors for public list
// @route   GET /api/donations/approved
// @access  Public
export const getApprovedDonors = async (req, res) => {
  try {
    const donors = await Donation.find({ status: 'approved' })
      .select('name amount createdAt')
      .sort({ createdAt: -1 });
    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search for approved donation for receipt
// @route   GET /api/donations/search
// @access  Public
export const searchDonation = async (req, res) => {
  try {
    const { query } = req.query; // name or transactionId
    const donation = await Donation.findOne({
      status: 'approved',
      $or: [
        { transactionId: query },
        { name: { $regex: query, $options: 'i' } }
      ]
    });

    if (!donation) {
      return res.status(404).json({ message: 'No approved donation found' });
    }

    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
