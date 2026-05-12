import AartiSchedule from '../models/AartiSchedule.js';

// @desc    Get aarti schedule
// @route   GET /api/aarti
// @access  Public
export const getAartiSchedule = async (req, res) => {
  try {
    const schedule = await AartiSchedule.find({}).sort({ order: 1 });
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add aarti
// @route   POST /api/aarti
// @access  Private
export const addAarti = async (req, res) => {
  try {
    const { name, time, session, priestName, order } = req.body;

    const aarti = new AartiSchedule({
      name,
      time,
      session,
      priestName,
      order: order || 0,
    });

    const createdAarti = await aarti.save();
    res.status(201).json(createdAarti);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update aarti
// @route   PUT /api/aarti/:id
// @access  Private
export const updateAarti = async (req, res) => {
  try {
    const { name, time, session, priestName, order } = req.body;

    const aarti = await AartiSchedule.findById(req.params.id);

    if (aarti) {
      aarti.name = name || aarti.name;
      aarti.time = time || aarti.time;
      aarti.session = session || aarti.session;
      aarti.priestName = priestName || aarti.priestName;
      if (order !== undefined) aarti.order = order;

      const updatedAarti = await aarti.save();
      res.json(updatedAarti);
    } else {
      res.status(404).json({ message: 'Aarti not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete aarti
// @route   DELETE /api/aarti/:id
// @access  Private
export const deleteAarti = async (req, res) => {
  try {
    const aarti = await AartiSchedule.findById(req.params.id);

    if (aarti) {
      await aarti.deleteOne();
      res.json({ message: 'Aarti removed' });
    } else {
      res.status(404).json({ message: 'Aarti not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
