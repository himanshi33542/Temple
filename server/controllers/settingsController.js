import Settings from '../models/Settings.js';
import cloudinary from '../utils/cloudinary.js';

// @desc    Get settings
// @route   GET /api/settings
// @access  Public
export const getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    if (settings) {
      res.json(settings);
    } else {
      res.json({});
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private
export const updateSettings = async (req, res) => {
  try {
    console.log('UPDATING SETTINGS - Body Keys:', Object.keys(req.body));
    console.log('UPDATING SETTINGS - Files:', req.files ? Object.keys(req.files) : 'None');

    const { 
      templeName, templeTagline, 
      aboutHistory, aboutMission, aboutValues,
      priestName, priestBio,
      contactAddress, contactPhone, contactEmail, contactTimings, contactMapIframe,
      footerCopyright, socialFacebook, socialInstagram, socialTwitter, socialYoutube
    } = req.body;
    
    let settings = await Settings.findOne();

    if (!settings) {
      console.log('No settings found, creating new one...');
      settings = new Settings({});
    }

    // Update fields if they are provided (not undefined and not the string "null" from frontend)
    const updateField = (key, value) => {
      if (value !== undefined && value !== 'null') {
        settings[key] = value;
      }
    };

    updateField('templeName', templeName);
    updateField('templeTagline', templeTagline);
    updateField('aboutHistory', aboutHistory);
    updateField('aboutMission', aboutMission);
    updateField('aboutValues', aboutValues);
    updateField('priestName', priestName);
    updateField('priestBio', priestBio);
    updateField('contactAddress', contactAddress);
    updateField('contactPhone', contactPhone);
    updateField('contactEmail', contactEmail);
    updateField('contactTimings', contactTimings);
    updateField('contactMapIframe', contactMapIframe);
    updateField('footerCopyright', footerCopyright);
    updateField('socialFacebook', socialFacebook);
    updateField('socialInstagram', socialInstagram);
    updateField('socialTwitter', socialTwitter);
    updateField('socialYoutube', socialYoutube);

    // Handle files if uploaded (heroImage, priestImage)
    if (req.files) {
      if (req.files.heroImage && req.files.heroImage[0]) {
        console.log('Uploading new hero image...');
        const file = req.files.heroImage[0];
        const b64 = Buffer.from(file.buffer).toString("base64");
        let dataURI = "data:" + file.mimetype + ";base64," + b64;
        const uploadRes = await cloudinary.uploader.upload(dataURI, {
          folder: 'temple/settings',
        });
        settings.heroImageUrl = uploadRes.secure_url;
      }

      if (req.files.priestImage && req.files.priestImage[0]) {
        console.log('Uploading new priest image...');
        const file = req.files.priestImage[0];
        const b64 = Buffer.from(file.buffer).toString("base64");
        let dataURI = "data:" + file.mimetype + ";base64," + b64;
        const uploadRes = await cloudinary.uploader.upload(dataURI, {
          folder: 'temple/settings',
        });
        settings.priestImageUrl = uploadRes.secure_url;
      }

      if (req.files.aboutHistoryImage && req.files.aboutHistoryImage[0]) {
        console.log('Uploading new about history image...');
        const file = req.files.aboutHistoryImage[0];
        const b64 = Buffer.from(file.buffer).toString("base64");
        let dataURI = "data:" + file.mimetype + ";base64," + b64;
        const uploadRes = await cloudinary.uploader.upload(dataURI, {
          folder: 'temple/settings',
        });
        settings.aboutHistoryImageUrl = uploadRes.secure_url;
      }
    }

    const updatedSettings = await settings.save();
    console.log('Settings saved successfully');
    res.json(updatedSettings);
  } catch (error) {
    console.error('ERROR UPDATING SETTINGS:', error);
    res.status(500).json({ message: error.message });
  }
};
