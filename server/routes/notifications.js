import express from 'express';
import { Notification, User, Doctor, Appointment } from '../models/index.js';
import { authenticateToken } from '../middleware/auth.js';
import { Op } from 'sequelize';

const router = express.Router();

// Get notifications for current user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = { userId: req.user.id };
    if (unreadOnly === 'true') {
      whereClause.isRead = false;
    }

    const notifications = await Notification.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
    });

    // Get unread count
    const unreadCount = await Notification.count({
      where: { userId: req.user.id, isRead: false },
    });

    res.json({
      success: true,
      data: {
        notifications: notifications.rows,
        unreadCount,
        pagination: {
          total: notifications.count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(notifications.count / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get notifications',
      error: error.message,
    });
  }
});

// Mark notification as read
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOne({
      where: { id, userId: req.user.id },
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    await notification.update({ isRead: true });

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: { notification },
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: error.message,
    });
  }
});

// Mark all notifications as read
router.put('/mark-all-read', authenticateToken, async (req, res) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { userId: req.user.id, isRead: false } }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read',
      error: error.message,
    });
  }
});

// Handle notification actions (confirm, reject, etc.)
router.post('/:id/action', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { action, data } = req.body;

    const notification = await Notification.findOne({
      where: { id, userId: req.user.id },
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    // Handle different action types
    switch (action) {
      case 'confirm_appointment':
        if (notification.relatedType === 'appointment') {
          await handleAppointmentConfirmation(notification.relatedId, req.user);
        }
        break;
      case 'reject_appointment':
        if (notification.relatedType === 'appointment') {
          await handleAppointmentRejection(notification.relatedId, req.user, data.reason);
        }
        break;
      case 'reschedule_appointment':
        if (notification.relatedType === 'appointment') {
          await handleAppointmentReschedule(notification.relatedId, req.user, data);
        }
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action type',
        });
    }

    // Mark notification as read and processed
    await notification.update({ isRead: true });

    res.json({
      success: true,
      message: 'Action processed successfully',
    });
  } catch (error) {
    console.error('Handle notification action error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process action',
      error: error.message,
    });
  }
});

// Helper functions
async function handleAppointmentConfirmation(appointmentId, user) {
  const appointment = await Appointment.findByPk(appointmentId, {
    include: [
      { model: User, as: 'patient' },
      { model: Doctor, as: 'doctor', include: [{ model: User, as: 'user' }] }
    ]
  });

  if (appointment) {
    await appointment.update({ status: 'confirmed' });
    
    // Create notification for patient
    await createNotification({
      userId: appointment.patientId,
      type: 'appointment_confirmed',
      title: 'Appointment Confirmed',
      message: `Your appointment on ${appointment.appointmentDate} at ${appointment.appointmentTime} has been confirmed by Dr. ${appointment.doctor.user.firstName} ${appointment.doctor.user.lastName}.`,
      relatedId: appointmentId,
      relatedType: 'appointment',
      priority: 'medium',
    });
  }
}

async function handleAppointmentRejection(appointmentId, user, reason) {
  const appointment = await Appointment.findByPk(appointmentId, {
    include: [
      { model: User, as: 'patient' },
      { model: Doctor, as: 'doctor', include: [{ model: User, as: 'user' }] }
    ]
  });

  if (appointment) {
    await appointment.update({ status: 'cancelled', notes: reason });
    
    // Create notification for patient
    await createNotification({
      userId: appointment.patientId,
      type: 'appointment_rejected',
      title: 'Appointment Cancelled',
      message: `Your appointment on ${appointment.appointmentDate} at ${appointment.appointmentTime} has been cancelled. Reason: ${reason}. Please contact us to reschedule.`,
      relatedId: appointmentId,
      relatedType: 'appointment',
      priority: 'high',
      actionRequired: true,
      actionType: 'reschedule',
    });
  }
}

async function handleAppointmentReschedule(appointmentId, user, rescheduleData) {
  // Implementation for rescheduling logic
  // This would involve updating the appointment and creating new notifications
}

// Utility function to create notifications
export async function createNotification(notificationData) {
  try {
    return await Notification.create(notificationData);
  } catch (error) {
    console.error('Create notification error:', error);
    throw error;
  }
}

export default router;