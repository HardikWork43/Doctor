import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Contact = sequelize.define('Contact', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('new', 'read', 'responded', 'closed'),
    defaultValue: 'new',
  },
  respondedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  response: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

export default Contact;