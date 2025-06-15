import express from 'express';
import { Doctor, User } from '../models/index.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Get all doctors
router.get('/', async (req, res) => {
  try {
    const { specialization, isAvailable } = req.query;

    let whereClause = {};
    if (specialization) {
      whereClause.specialization = specialization;
    }
    if (isAvailable !== undefined) {
      whereClause.isAvailable = isAvailable === 'true';
    }

    const doctors = await Doctor.findAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
        where: { isActive: true },
      }],
      order: [['createdAt', 'ASC']],
    });

    res.json({
      success: true,
      data: { doctors },
    });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get doctors',
      error: error.message,
    });
  }
});

// Get doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findByPk(id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
      }],
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    res.json({
      success: true,
      data: { doctor },
    });
  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get doctor',
      error: error.message,
    });
  }
});

// Create doctor profile (admin only)
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const {
      userId,
      specialization,
      licenseNumber,
      experience,
      education,
      bio,
      consultationFee,
      availableFrom,
      availableTo,
      workingDays,
    } = req.body;

    // Check if user exists and is not already a doctor
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const existingDoctor = await Doctor.findOne({ where: { userId } });
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: 'User already has a doctor profile',
      });
    }

    // Update user role to doctor
    await user.update({ role: 'doctor' });

    // Create doctor profile
    const doctor = await Doctor.create({
      userId,
      specialization,
      licenseNumber,
      experience,
      education,
      bio,
      consultationFee,
      availableFrom,
      availableTo,
      workingDays,
    });

    const doctorWithUser = await Doctor.findByPk(doctor.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
      }],
    });

    res.status(201).json({
      success: true,
      message: 'Doctor profile created successfully',
      data: { doctor: doctorWithUser },
    });
  } catch (error) {
    console.error('Create doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create doctor profile',
      error: error.message,
    });
  }
});

// Update doctor profile
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      specialization,
      experience,
      education,
      bio,
      consultationFee,
      availableFrom,
      availableTo,
      workingDays,
      isAvailable,
    } = req.body;

    const doctor = await Doctor.findByPk(id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    // Check permissions
    if (req.user.role === 'doctor' && doctor.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own profile',
      });
    }

    await doctor.update({
      specialization,
      experience,
      education,
      bio,
      consultationFee,
      availableFrom,
      availableTo,
      workingDays,
      isAvailable,
    });

    const updatedDoctor = await Doctor.findByPk(id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
      }],
    });

    res.json({
      success: true,
      message: 'Doctor profile updated successfully',
      data: { doctor: updatedDoctor },
    });
  } catch (error) {
    console.error('Update doctor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update doctor profile',
      error: error.message,
    });
  }
});

export default router;