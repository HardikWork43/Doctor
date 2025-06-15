import express from 'express';
import { User, Appointment, MedicalRecord, Doctor } from '../models/index.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Get all patients (admin/doctor only)
router.get('/', authenticateToken, authorizeRoles('admin', 'doctor'), async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = { role: 'patient' };
    if (search) {
      whereClause = {
        ...whereClause,
        [Op.or]: [
          { firstName: { [Op.like]: `%${search}%` } },
          { lastName: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    const patients = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: {
        patients: patients.rows,
        pagination: {
          total: patients.count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(patients.count / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get patients',
      error: error.message,
    });
  }
});

// Get patient details (admin/doctor or own profile)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check permissions
    if (req.user.role === 'patient' && parseInt(id) !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only access your own profile',
      });
    }

    const patient = await User.findOne({
      where: { id, role: 'patient' },
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Appointment,
          as: 'patientAppointments',
          include: [{
            model: Doctor,
            as: 'doctor',
            include: [{
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName'],
            }],
          }],
          order: [['appointmentDate', 'DESC']],
        },
        {
          model: MedicalRecord,
          as: 'medicalRecords',
          include: [{
            model: Doctor,
            as: 'doctor',
            include: [{
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName'],
            }],
          }],
          order: [['visitDate', 'DESC']],
        },
      ],
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    res.json({
      success: true,
      data: { patient },
    });
  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get patient',
      error: error.message,
    });
  }
});

export default router;