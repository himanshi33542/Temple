import User from '../models/User.js';
import Settings from '../models/Settings.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    console.log(`Login attempt for username: ${username}`);
    
    if (!user) {
      console.log(`User not found: ${username}`);
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isMatch = await user.matchPassword(password);
    console.log(`Password match result: ${isMatch}`);

    if (isMatch) {
      res.json({
        _id: user._id,
        username: user.username,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify token
// @route   GET /api/auth/verify
// @access  Private
export const verify = async (req, res) => {
  try {
    // If it passes the protect middleware, the token is valid
    res.json({
      _id: req.user._id,
      username: req.user.username,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create first admin (Uncomment to use once, then comment out)
// @route   POST /api/auth/setup
// @access  Public
export const setup = async (req, res) => {
  try {
    const userExists = await User.findOne({ username: 'admin' });
    if (userExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const user = await User.create({
      username: 'admin',
      password: 'password123',
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetAdmin = async (req, res) => {
  try {
    await User.deleteOne({ username: 'admin' });
    await User.create({
      username: 'admin',
      password: 'password123',
    });

    // Reset settings as well
    await Settings.deleteOne({});
    await Settings.create({
      templeName: 'Chardham Mandir',
      templeTagline: 'Experience the essence of India’s four sacred pilgrimage sites in one divine space.',
      priestName: 'Acharya Shastri Ji',
      priestBio: 'This temple is inspired by the sacred Char Dham pilgrimage of India and aims to provide a similar spiritual experience within Jhunjhunu.'
    });

    // Also initialize settings if they don't exist
    let settings = await Settings.findOne();
    if (!settings) {
      console.log('Initializing default Chardham settings...');
      await Settings.create({
        templeName: 'Chardham Mandir',
        templeTagline: 'Experience the Divine Char Dham Yatra in Jhunjhunu',
        aboutHistory: 'Chardham Mandir in Jhunjhunu is a spiritually inspired temple designed to bring together the essence of India’s four sacred pilgrimage sites — Badrinath, Kedarnath, Gangotri, and Yamunotri — into one divine space.',
        contactAddress: 'Jhunjhunu, Rajasthan, India',
        contactPhone: '+91 98765 43210',
        contactEmail: 'info@chardhammandir.com',
        contactTimings: '06:00 AM - 09:00 PM',
        footerCopyright: 'Chardham Mandir, Jhunjhunu'
      });
    }

    res.json({ message: 'Admin reset successful. Username: admin, Password: password123' });
  } catch (error) {
    console.error('RESET ADMIN ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user password
// @route   PUT /api/auth/profile
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (user && (await user.matchPassword(currentPassword))) {
      user.password = newPassword;
      await user.save();
      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(401).json({ message: 'Invalid current password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
