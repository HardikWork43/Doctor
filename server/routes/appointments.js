import express from 'express';
import { Appointment, User, Doctor } from '../models/index.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import { Op } from 'sequelize';

const router = express.Router();

// Get all appointments (admin/doctor) or user's appointments (patient)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, date } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};
    let includeClause = [
      {
        model: User,
        as: 'patient',
        attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
      },
      {
        model: Doctor,
        as: 'doctor',
        include: [{
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName'],
        }],
      },
    ];

    // Filter by user role
    if (req.user.role === 'patient') {
      whereClause.patientId = req.user.id;
    } else if (req.user.role === 'doctor') {
      const doctorProfile = await Doctor.findOne({ where: { userId: req.user.id } });
      if (doctorProfile) {
        whereClause.doctorId = doctorProfile.id;
      }
    }

    // Filter by status
    if (status) {
      whereClause.status = status;
    }

    // Filter by date
    if (date) {
      whereClause.appointmentDate = date;
    }

    const appointments = await Appointment.findAndCountAll({
      where: whereClause,
      include: includeClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['appointmentDate', 'ASC'], ['appointmentTime', 'ASC']],
    });

    res.json({
      success: true,
      data: {
        appointments: appointments.rows,
        pagination: {
          total: appointments.count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(appointments.count / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get appointments',
      error: error.message,
    });
  }
});

// Create appointment
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      doctorId,
      appointmentDate,
      appointmentTime,
      service,
      reason,
    } = req.body;

    // Check if doctor exists
    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    // Check for conflicting appointments
    const existingAppointment = await Appointment.findOne({
      where: {
        doctorId,
        appointmentDate,
        appointmentTime,
        status: {
          [Op.not]: 'cancelled',
        },
      },
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked',
      });
    }

    const appointment = await Appointment.create({
      patientId: req.user.id,
      doctorId,
      appointmentDate,
      appointmentTime,
      service,
      reason,
      fee: doctor.consultationFee,
    });

    const appointmentWithDetails = await Appointment.findByPk(appointment.id, {
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
        },
        {
          model: Doctor,
          as: 'doctor',
          include: [{
            model: User,
            as: 'user',
            attributes: ['firstName', 'lastName'],
          }],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: { appointment: appointmentWithDetails },
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create appointment',
      error: error.message,
    });
  }
});

// Update appointment
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      appointmentDate,
      appointmentTime,
      service,
      reason,
      status,
      notes,
    } = req.body;

    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Check permissions
    if (req.user.role === 'patient' && appointment.patientId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own appointments',
      });
    }

    if (req.user.role === 'doctor') {
      const doctorProfile = await Doctor.findOne({ where: { userId: req.user.id } });
      if (!doctorProfile || appointment.doctorId !== doctorProfile.id) {
        return res.status(403).json({
          success: false,
          message: 'You can only update your own appointments',
        });
      }
    }

    // Update appointment
    await appointment.update({
      appointmentDate,
      appointmentTime,
      service,
      reason,
      status,
      notes,
    });

    const updatedAppointment = await Appointment.findByPk(id, {
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
        },
        {
          model: Doctor,
          as: 'doctor',
          include: [{
            model: User,
            as: 'user',
            attributes: ['firstName', 'lastName'],
          }],
        },
      ],
    });

    res.json({
      success: true,
      message: 'Appointment updated successfully',
      data: { appointment: updatedAppointment },
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update appointment',
      error: error.message,
    });
  }
});

// Cancel appointment
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Check permissions
    if (req.user.role === 'patient' && appointment.patientId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own appointments',
      });
    }

    await appointment.update({ status: 'cancelled' });

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel appointment',
      error: error.message,
    });
  }
});

export default router;