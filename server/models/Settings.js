import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  heroImageUrl: {
    type: String,
  },
  templeName: {
    type: String,
    default: 'Chardham Mandir',
  },
  templeTagline: {
    type: String,
  },
  // About Us Section
  aboutHistory: {
    type: String,
  },
  aboutHistoryImageUrl: {
    type: String,
  },
  aboutMission: {
    type: String,
  },
  aboutValues: {
    type: String,
  },
  // Priest Section
  priestName: {
    type: String,
  },
  priestBio: {
    type: String,
  },
  priestImageUrl: {
    type: String,
  },
  // Contact Section
  contactAddress: {
    type: String,
  },
  contactPhone: {
    type: String,
  },
  contactEmail: {
    type: String,
  },
  contactTimings: {
    type: String, // "06:00 AM - 09:00 PM"
  },
  contactMapIframe: {
    type: String,
  },
  // Footer & Social
  footerCopyright: {
    type: String,
  },
  socialFacebook: { type: String },
  socialInstagram: { type: String },
  socialTwitter: { type: String },
  socialYoutube: { type: String },
}, { timestamps: true });

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
