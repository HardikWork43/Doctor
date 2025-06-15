import express from 'express';
import { User, Doctor, Appointment, Contact, BlogPost, Service } from '../models/index.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import { Op } from 'sequelize';

const router = express.Router();

// Dashboard statistics (admin only)
router.get('/dashboard', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));

    // Get counts
    const totalPatients = await User.count({ where: { role: 'patient' } });
    const totalDoctors = await Doctor.count();
    const totalAppointments = await Appointment.count();
    const pendingContacts = await Contact.count({ where: { status: 'new' } });

    // Appointments this week
    const appointmentsThisWeek = await Appointment.count({
      where: {
        appointmentDate: {
          [Op.gte]: startOfWeek,
        },
      },
    });

    // Appointments this month
    const appointmentsThisMonth = await Appointment.count({
      where: {
        appointmentDate: {
          [Op.gte]: startOfMonth,
        },
      },
    });

    // Recent appointments
    const recentAppointments = await Appointment.findAll({
      limit: 5,
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['firstName', 'lastName'],
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
      order: [['createdAt', 'DESC']],
    });

    // Appointment status distribution
    const appointmentsByStatus = await Appointment.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['status'],
    });

    res.json({
      success: true,
      data: {
        statistics: {
          totalPatients,
          totalDoctors,
          totalAppointments,
          pendingContacts,
          appointmentsThisWeek,
          appointmentsThisMonth,
        },
        recentAppointments,
        appointmentsByStatus,
      },
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard data',
      error: error.message,
    });
  }
});

// Get all users (admin only)
router.get('/users', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};
    if (role) {
      whereClause.role = role;
    }
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

    const users = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      include: [{
        model: Doctor,
        as: 'doctorProfile',
        required: false,
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: {
        users: users.rows,
        pagination: {
          total: users.count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(users.count / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users',
      error: error.message,
    });
  }
});

// Update user status (admin only)
router.put('/users/:id/status', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    await user.update({ isActive });

    res.json({
      success: true,
      message: 'User status updated successfully',
      data: { user },
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status',
      error: error.message,
    });
  }
});

export default router;