import Event from '../models/Event.js';
import cloudinary from '../utils/cloudinary.js';

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({}).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add an event
// @route   POST /api/events
// @access  Private
export const addEvent = async (req, res) => {
  try {
    const { title, description, date, category, isPast } = req.body;
    let image = '';

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const uploadRes = await cloudinary.uploader.upload(dataURI, {
        folder: 'temple/events',
      });
      image = uploadRes.secure_url;
    }

    const event = new Event({
      title,
      description,
      date,
      image,
      category,
      isPast: isPast === 'true' || isPast === true,
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private
export const updateEvent = async (req, res) => {
  try {
    const { title, description, date, category, isPast } = req.body;
    
    const event = await Event.findById(req.params.id);

    if (event) {
      event.title = title || event.title;
      event.description = description || event.description;
      event.date = date || event.date;
      event.category = category || event.category;
      
      if (isPast !== undefined) {
        event.isPast = isPast === 'true' || isPast === true;
      }

      if (req.file) {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const uploadRes = await cloudinary.uploader.upload(dataURI, {
          folder: 'temple/events',
        });
        event.image = uploadRes.secure_url;
      }

      const updatedEvent = await event.save();
      res.json(updatedEvent);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (event) {
      await event.deleteOne();
      res.json({ message: 'Event removed' });
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
