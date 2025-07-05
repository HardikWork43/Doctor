import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  type: {
    type: DataTypes.ENUM(
      'appointment_request',
      'appointment_confirmed',
      'appointment_rejected',
      'appointment_completed',
      'appointment_cancelled',
      'medical_report_ready',
      'doctor_unavailable',
      'urgent_notice',
      'payment_reminder',
      'appointment_reminder'
    ),
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  relatedId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'ID of related entity (appointment, medical record, etc.)',
  },
  relatedType: {
    type: DataTypes.ENUM('appointment', 'medical_record', 'payment', 'general'),
    allowNull: true,
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium',
  },
  actionRequired: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  actionType: {
    type: DataTypes.ENUM('confirm', 'reject', 'reschedule', 'view', 'pay'),
    allowNull: true,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Additional data for the notification',
  },
});

export default Notification;