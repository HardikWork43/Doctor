import express from 'express';
import { DoctorAvailability, Doctor, User, Appointment, Notification } from '../models/index.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import { createNotification } from './notifications.js';
import { Op } from 'sequelize';

const router = express.Router();

// Get doctor availability
router.get('/:doctorId', async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { startDate, endDate } = req.query;

    let whereClause = { doctorId };
    if (startDate && endDate) {
      whereClause.date = {
        [Op.between]: [startDate, endDate],
      };
    }

    const availability = await DoctorAvailability.findAll({
      where: whereClause,
      order: [['date', 'ASC']],
    });

    res.json({
      success: true,
      data: { availability },
    });
  } catch (error) {
    console.error('Get doctor availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get doctor availability',
      error: error.message,
    });
  }
});

// Set doctor unavailable for specific date(s)
router.post('/unavailable', authenticateToken, authorizeRoles('doctor'), async (req, res) => {
  try {
    const { dates, reason, emergencyOnly = false } = req.body;

    // Get doctor profile
    const doctorProfile = await Doctor.findOne({ where: { userId: req.user.id } });
    if (!doctorProfile) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found',
      });
    }

    // Set unavailable for each date
    const unavailabilityRecords = [];
    for (const date of dates) {
      const [availability, created] = await DoctorAvailability.findOrCreate({
        where: { doctorId: doctorProfile.id, date },
        defaults: {
          doctorId: doctorProfile.id,
          date,
          isAvailable: false,
          reason,
          emergencyOnly,
        },
      });

      if (!created) {
        await availability.update({
          isAvailable: false,
          reason,
          emergencyOnly,
        });
      }

      unavailabilityRecords.push(availability);

      // Cancel existing appointments for this date if not emergency only
      if (!emergencyOnly) {
        const appointmentsToCancel = await Appointment.findAll({
          where: {
            doctorId: doctorProfile.id,
            appointmentDate: date,
            status: { [Op.in]: ['scheduled', 'confirmed'] },
          },
          include: [{ model: User, as: 'patient' }],
        });

        for (const appointment of appointmentsToCancel) {
          await appointment.update({ status: 'cancelled', notes: `Doctor unavailable: ${reason}` });

          // Create notification for patient
          await createNotification({
            userId: appointment.patientId,
            type: 'appointment_cancelled',
            title: 'Appointment Cancelled',
            message: `Your appointment on ${appointment.appointmentDate} at ${appointment.appointmentTime} has been cancelled due to doctor unavailability. Reason: ${reason}. Please contact us to reschedule.`,
            relatedId: appointment.id,
            relatedType: 'appointment',
            priority: 'high',
            actionRequired: true,
            actionType: 'reschedule',
            metadata: {
              originalDate: appointment.appointmentDate,
              originalTime: appointment.appointmentTime,
              doctorName: `${req.user.firstName} ${req.user.lastName}`,
            },
          });
        }
      }
    }

    res.json({
      success: true,
      message: 'Doctor availability updated successfully',
      data: { unavailabilityRecords },
    });
  } catch (error) {
    console.error('Set doctor unavailable error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set doctor unavailable',
      error: error.message,
    });
  }
});

// Remove unavailability (make doctor available again)
router.delete('/unavailable/:id', authenticateToken, authorizeRoles('doctor'), async (req, res) => {
  try {
    const { id } = req.params;

    const availability = await DoctorAvailability.findByPk(id);
    if (!availability) {
      return res.status(404).json({
        success: false,
        message: 'Availability record not found',
      });
    }

    // Check if this belongs to the current doctor
    const doctorProfile = await Doctor.findOne({ where: { userId: req.user.id } });
    if (availability.doctorId !== doctorProfile.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to modify this availability record',
      });
    }

    await availability.destroy();

    res.json({
      success: true,
      message: 'Doctor availability restored',
    });
  } catch (error) {
    console.error('Remove doctor unavailability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove doctor unavailability',
      error: error.message,
    });
  }
});

export default router;