import mongoose from 'mongoose';

const shrineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  deity: {
    type: String,
  },
  description: {
    type: String,
  },
  significance: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  order: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

const Shrine = mongoose.model('Shrine', shrineSchema);
export default Shrine;
