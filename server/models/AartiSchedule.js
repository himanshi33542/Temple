import mongoose from 'mongoose';

const aartiScheduleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  session: {
    type: String, // Morning, Afternoon, Evening
  },
  priestName: {
    type: String,
  },
  order: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

const AartiSchedule = mongoose.model('AartiSchedule', aartiScheduleSchema);
export default AartiSchedule;
