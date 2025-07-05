import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const DoctorAvailability = sequelize.define('DoctorAvailability', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  doctorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Doctors',
      key: 'id',
    },
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  timeSlots: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Specific time slots that are unavailable',
  },
  emergencyOnly: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

export default DoctorAvailability;