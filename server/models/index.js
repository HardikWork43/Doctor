import User from './User.js';
import Doctor from './Doctor.js';
import Appointment from './Appointment.js';
import MedicalRecord from './MedicalRecord.js';
import Service from './Service.js';
import BlogPost from './BlogPost.js';
import Contact from './Contact.js';
import Notification from './Notification.js';
import DoctorAvailability from './DoctorAvailability.js';

// Define associations
User.hasOne(Doctor, { foreignKey: 'userId', as: 'doctorProfile' });
Doctor.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Appointment, { foreignKey: 'patientId', as: 'patientAppointments' });
Appointment.belongsTo(User, { foreignKey: 'patientId', as: 'patient' });

Doctor.hasMany(Appointment, { foreignKey: 'doctorId', as: 'doctorAppointments' });
Appointment.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' });

User.hasMany(MedicalRecord, { foreignKey: 'patientId', as: 'medicalRecords' });
MedicalRecord.belongsTo(User, { foreignKey: 'patientId', as: 'patient' });

Doctor.hasMany(MedicalRecord, { foreignKey: 'doctorId', as: 'treatedRecords' });
MedicalRecord.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' });

Appointment.hasOne(MedicalRecord, { foreignKey: 'appointmentId', as: 'medicalRecord' });
MedicalRecord.belongsTo(Appointment, { foreignKey: 'appointmentId', as: 'appointment' });

User.hasMany(BlogPost, { foreignKey: 'authorId', as: 'blogPosts' });
BlogPost.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Doctor.hasMany(DoctorAvailability, { foreignKey: 'doctorId', as: 'availability' });
DoctorAvailability.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' });

export {
  User,
  Doctor,
  Appointment,
  MedicalRecord,
  Service,
  BlogPost,
  Contact,
  Notification,
  DoctorAvailability,
};