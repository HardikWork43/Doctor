import { User, Doctor, Service, BlogPost, Appointment, MedicalRecord, Contact } from '../models/index.js';
import bcrypt from 'bcryptjs';

export const seedDatabase = async () => {
  try {
    console.log('Seeding database...');

    // Create admin user
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@dentalcare.com',
      password: 'admin123',
      role: 'admin',
      phone: '+1-555-000-0001',
    });

    // Create doctor users
    const doctorUsers = await User.bulkCreate([
      {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@hospital.com',
        password: 'doctor123',
        role: 'doctor',
        phone: '+1-555-000-0002',
      },
      {
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'michael.chen@hospital.com',
        password: 'doctor123',
        role: 'doctor',
        phone: '+1-555-000-0003',
      },
      {
        firstName: 'Emily',
        lastName: 'Rodriguez',
        email: 'emily.rodriguez@hospital.com',
        password: 'doctor123',
        role: 'doctor',
        phone: '+1-555-000-0004',
      },
    ]);

    // Create doctor profiles
    const doctors = await Doctor.bulkCreate([
      {
        userId: doctorUsers[0].id,
        specialization: 'General Dentistry',
        licenseNumber: 'DDS001',
        experience: 10,
        education: 'DDS from Harvard School of Dental Medicine',
        bio: 'Dr. Johnson has over 10 years of experience in general dentistry with a focus on preventive care.',
        consultationFee: 150.00,
        availableFrom: '09:00',
        availableTo: '17:00',
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      },
      {
        userId: doctorUsers[1].id,
        specialization: 'Orthodontics',
        licenseNumber: 'DDS002',
        experience: 8,
        education: 'DDS from UCLA School of Dentistry, Orthodontics Residency',
        bio: 'Specializing in orthodontics, Dr. Chen helps patients achieve perfectly aligned smiles.',
        consultationFee: 200.00,
        availableFrom: '10:00',
        availableTo: '18:00',
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      },
      {
        userId: doctorUsers[2].id,
        specialization: 'Cosmetic Dentistry',
        licenseNumber: 'DDS003',
        experience: 12,
        education: 'DDS from NYU College of Dentistry, Cosmetic Dentistry Fellowship',
        bio: 'With expertise in cosmetic procedures, Dr. Rodriguez is dedicated to creating beautiful smiles.',
        consultationFee: 180.00,
        availableFrom: '08:00',
        availableTo: '16:00',
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      },
    ]);

    // Create patient users
    const patientUsers = await User.bulkCreate([
      {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@example.com',
        password: 'patient123',
        role: 'patient',
        phone: '+1-555-123-4567',
        dateOfBirth: '1985-06-15',
        address: '123 Main St, Anytown, ST 12345',
        insuranceProvider: 'Delta Dental',
        insuranceMemberId: 'DD123456789',
      },
      {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        password: 'patient123',
        role: 'patient',
        phone: '+1-555-987-6543',
        dateOfBirth: '1990-03-22',
        address: '456 Oak Ave, Somewhere, ST 67890',
        insuranceProvider: 'Cigna Dental',
        insuranceMemberId: 'CG987654321',
      },
      {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@example.com',
        password: 'patient123',
        role: 'patient',
        phone: '+1-555-555-1234',
        dateOfBirth: '1985-06-15',
        address: '789 Pine St, Somewhere, ST 12345',
        insuranceProvider: 'Delta Dental PPO',
        insuranceMemberId: 'DD123456789',
      },
    ]);

    // Create appointments
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    await Appointment.bulkCreate([
      {
        patientId: patientUsers[0].id,
        doctorId: doctors[0].id,
        appointmentDate: today.toISOString().split('T')[0],
        appointmentTime: '10:00',
        service: 'Dental Cleaning',
        reason: 'Regular checkup and cleaning',
        status: 'confirmed',
        fee: 150.00,
      },
      {
        patientId: patientUsers[1].id,
        doctorId: doctors[1].id,
        appointmentDate: tomorrow.toISOString().split('T')[0],
        appointmentTime: '14:30',
        service: 'Orthodontic Consultation',
        reason: 'Initial consultation for braces',
        status: 'scheduled',
        fee: 200.00,
      },
      {
        patientId: patientUsers[2].id,
        doctorId: doctors[0].id,
        appointmentDate: nextWeek.toISOString().split('T')[0],
        appointmentTime: '09:00',
        service: 'Dental Checkup',
        reason: 'Routine dental examination',
        status: 'scheduled',
        fee: 150.00,
      },
    ]);

    // Create medical records
    await MedicalRecord.bulkCreate([
      {
        patientId: patientUsers[0].id,
        doctorId: doctors[0].id,
        visitDate: new Date('2024-01-15'),
        procedure: 'Dental Checkup',
        diagnosis: 'Good oral health, no cavities detected',
        treatment: 'Professional cleaning performed',
        notes: 'Patient maintains excellent oral hygiene. Recommended to continue current routine.',
        prescriptions: [
          {
            medication: 'Fluoride Rinse',
            dosage: 'Use daily after brushing',
            duration: 'Ongoing'
          }
        ],
      },
      {
        patientId: patientUsers[1].id,
        doctorId: doctors[1].id,
        visitDate: new Date('2024-02-10'),
        procedure: 'Orthodontic Assessment',
        diagnosis: 'Mild crowding of lower teeth',
        treatment: 'Treatment plan developed for clear aligners',
        notes: 'Patient is a good candidate for Invisalign treatment. Estimated treatment time: 12-18 months.',
        prescriptions: [],
      },
    ]);

    // Create services
    await Service.bulkCreate([
      {
        name: 'Dental Cleaning',
        category: 'General Dentistry',
        description: 'Professional teeth cleaning and polishing',
        price: 120.00,
        duration: 60,
        icon: 'Tooth',
      },
      {
        name: 'Dental Checkup',
        category: 'General Dentistry',
        description: 'Comprehensive dental examination',
        price: 80.00,
        duration: 30,
        icon: 'Search',
      },
      {
        name: 'Teeth Whitening',
        category: 'Cosmetic Dentistry',
        description: 'Professional teeth whitening treatment',
        price: 300.00,
        duration: 90,
        icon: 'Smile',
      },
      {
        name: 'Dental Filling',
        category: 'Restorative Dentistry',
        description: 'Tooth-colored composite fillings',
        price: 200.00,
        duration: 45,
        icon: 'Wrench',
      },
      {
        name: 'Root Canal',
        category: 'Endodontics',
        description: 'Root canal therapy',
        price: 800.00,
        duration: 120,
        icon: 'AlertCircle',
      },
      {
        name: 'Dental Implant',
        category: 'Oral Surgery',
        description: 'Single tooth implant placement',
        price: 2500.00,
        duration: 180,
        icon: 'Plus',
      },
      {
        name: 'Orthodontic Consultation',
        category: 'Orthodontics',
        description: 'Initial consultation for orthodontic treatment',
        price: 150.00,
        duration: 60,
        icon: 'AlignLeft',
      },
    ]);

    // Create contact submissions
    await Contact.bulkCreate([
      {
        name: 'Alex Wilson',
        email: 'alex@example.com',
        phone: '+1-555-111-2222',
        subject: 'Insurance Question',
        message: 'Do you accept XYZ insurance? I would like to schedule an appointment.',
        status: 'new',
      },
      {
        name: 'Emma Davis',
        email: 'emma@example.com',
        phone: '+1-555-333-4444',
        subject: 'Pain After Procedure',
        message: 'I am experiencing some discomfort after my cleaning yesterday. Is this normal?',
        status: 'read',
      },
    ]);

    // Create blog posts
    await BlogPost.bulkCreate([
      {
        title: 'The Importance of Regular Dental Check-ups',
        slug: 'importance-regular-dental-checkups',
        excerpt: 'Learn why regular dental visits are crucial for maintaining optimal oral health.',
        content: 'Regular dental check-ups are essential for maintaining good oral health. During these visits, your dentist can detect problems early, provide professional cleaning, and offer personalized advice for your oral care routine.',
        authorId: adminUser.id,
        category: 'Preventive Care',
        tags: ['dental health', 'prevention', 'checkups'],
        isPublished: true,
        publishedAt: new Date(),
      },
      {
        title: 'Understanding Tooth Sensitivity',
        slug: 'understanding-tooth-sensitivity',
        excerpt: 'Discover the causes behind tooth sensitivity and effective treatments.',
        content: 'Tooth sensitivity affects millions of people and can make eating uncomfortable. Understanding the causes and available treatments can help you find relief and protect your teeth.',
        authorId: adminUser.id,
        category: 'Dental Health',
        tags: ['sensitivity', 'treatment', 'oral health'],
        isPublished: true,
        publishedAt: new Date(),
      },
    ]);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};