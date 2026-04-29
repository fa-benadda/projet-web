const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');
const protect = require('../middleware/authMiddleware');

// GET all skills
router.get('/', async (req, res) => {
  const skills = await Skill.find().populate('owner', 'name email');
  res.json(skills);
});

// POST create skill (protected)
router.post('/', protect, async (req, res) => {
  const { title, description, category } = req.body;
  try {
    const skill = await Skill.create({ title, description, category, owner: req.user.id });
    res.status(201).json(skill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update skill (protected)
router.put('/:id', protect, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: 'Not found' });
    if (skill.owner.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    const updated = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE skill (protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: 'Not found' });
    if (skill.owner.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    await skill.deleteOne();
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;