import Shrine from '../models/Shrine.js';
import cloudinary from '../utils/cloudinary.js';

// @desc    Get all shrines
// @route   GET /api/shrines
// @access  Public
export const getShrines = async (req, res) => {
  try {
    const shrines = await Shrine.find().sort({ order: 1 });
    res.json(shrines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a shrine
// @route   POST /api/shrines
// @access  Private
export const createShrine = async (req, res) => {
  try {
    const { name, deity, description, significance, order } = req.body;
    let imageUrl = '';

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'temple/shrines',
      });
      imageUrl = result.secure_url;
    }

    const shrine = await Shrine.create({
      name, deity, description, significance, order, imageUrl
    });

    res.status(201).json(shrine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a shrine
// @route   PUT /api/shrines/:id
// @access  Private
export const updateShrine = async (req, res) => {
  try {
    const shrine = await Shrine.findById(req.params.id);
    if (!shrine) return res.status(404).json({ message: 'Shrine not found' });

    const { name, deity, description, significance, order } = req.body;

    shrine.name = name || shrine.name;
    shrine.deity = deity || shrine.deity;
    shrine.description = description || shrine.description;
    shrine.significance = significance || shrine.significance;
    shrine.order = order || shrine.order;

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'temple/shrines',
      });
      shrine.imageUrl = result.secure_url;
    }

    const updatedShrine = await shrine.save();
    res.json(updatedShrine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a shrine
// @route   DELETE /api/shrines/:id
// @access  Private
export const deleteShrine = async (req, res) => {
  try {
    const shrine = await Shrine.findById(req.params.id);
    if (!shrine) return res.status(404).json({ message: 'Shrine not found' });

    await shrine.deleteOne();
    res.json({ message: 'Shrine removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
