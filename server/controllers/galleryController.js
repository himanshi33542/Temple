import GalleryPhoto from '../models/GalleryPhoto.js';
import cloudinary from '../utils/cloudinary.js';

// @desc    Get all gallery photos
// @route   GET /api/gallery
// @access  Public
export const getPhotos = async (req, res) => {
  try {
    const photos = await GalleryPhoto.find({}).sort({ order: 1, createdAt: -1 });
    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a photo
// @route   POST /api/gallery
// @access  Private
export const addPhoto = async (req, res) => {
  try {
    const { category, caption } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No images provided' });
    }

    const uploadedPhotos = [];
    const maxOrderPhoto = await GalleryPhoto.findOne().sort({ order: -1 });
    let currentOrder = maxOrderPhoto ? maxOrderPhoto.order + 1 : 0;

    for (const file of files) {
      // Convert buffer to base64 for Cloudinary upload
      const b64 = Buffer.from(file.buffer).toString("base64");
      let dataURI = "data:" + file.mimetype + ";base64," + b64;
      
      const uploadRes = await cloudinary.uploader.upload(dataURI, {
        folder: 'temple/gallery',
      });

      const photo = new GalleryPhoto({
        url: uploadRes.secure_url,
        publicId: uploadRes.public_id,
        category: category || 'General',
        caption: caption || '',
        order: currentOrder++,
      });

      const savedPhoto = await photo.save();
      uploadedPhotos.push(savedPhoto);
    }

    res.status(201).json(uploadedPhotos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a photo
// @route   DELETE /api/gallery/:id
// @access  Private
export const deletePhoto = async (req, res) => {
  try {
    const photo = await GalleryPhoto.findById(req.params.id);

    if (photo) {
      // Delete from cloudinary
      if (photo.publicId) {
        await cloudinary.uploader.destroy(photo.publicId);
      }
      await photo.deleteOne();
      res.json({ message: 'Photo removed' });
    } else {
      res.status(404).json({ message: 'Photo not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reorder photos
// @route   PATCH /api/gallery/reorder
// @access  Private
export const reorderPhotos = async (req, res) => {
  try {
    const { items } = req.body; // Array of { id, order }

    if (items && items.length > 0) {
      for (let item of items) {
        await GalleryPhoto.findByIdAndUpdate(item.id, { order: item.order });
      }
      res.json({ message: 'Photos reordered successfully' });
    } else {
      res.status(400).json({ message: 'No items provided' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
