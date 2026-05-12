import mongoose from 'mongoose';

const galleryPhotoSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Temple', 'Festival', 'Puja', 'Community', 'Other'],
    default: 'Other',
  },
  caption: {
    type: String,
  },
  order: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

const GalleryPhoto = mongoose.model('GalleryPhoto', galleryPhotoSchema);
export default GalleryPhoto;
