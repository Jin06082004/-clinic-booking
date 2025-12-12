require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');

const User = require('./models/User');
const Clinic = require('./models/Clinic');
const Doctor = require('./models/Doctor');
const Schedule = require('./models/Schedule');
const Booking = require('./models/Booking');

// Sample data
const users = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    phone: '+1234567890',
    role: 'user'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    phone: '+1234567891',
    role: 'user'
  },
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    phone: '+1234567892',
    role: 'admin'
  }
];

const clinics = [
  {
    name: 'City General Hospital',
    description: 'A comprehensive healthcare facility offering a wide range of medical services with state-of-the-art equipment and experienced professionals.',
    address: '123 Main Street',
    city: 'New York',
    phone: '+1-555-0101',
    email: 'contact@citygeneralhospital.com',
    specialties: ['Cardiology', 'Orthopedics', 'Pediatrics', 'General Medicine'],
    rating: 4.5
  },
  {
    name: 'Sunrise Medical Center',
    description: 'Modern medical center specializing in primary care and preventive medicine with a patient-first approach.',
    address: '456 Oak Avenue',
    city: 'Los Angeles',
    phone: '+1-555-0102',
    email: 'info@sunrisemedical.com',
    specialties: ['Family Medicine', 'Internal Medicine', 'Dermatology'],
    rating: 4.7
  },
  {
    name: 'Green Valley Clinic',
    description: 'Community clinic providing quality healthcare services with a focus on accessibility and affordability.',
    address: '789 Pine Road',
    city: 'Chicago',
    phone: '+1-555-0103',
    email: 'hello@greenvalleyclinic.com',
    specialties: ['General Practice', 'Pediatrics', 'Gynecology'],
    rating: 4.3
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Clinic.deleteMany({});
    await Doctor.deleteMany({});
    await Schedule.deleteMany({});
    await Booking.deleteMany({});

    // Create users
    console.log('Creating users...');
    const createdUsers = await User.create(users);
    console.log(`Created ${createdUsers.length} users`);

    // Create clinics
    console.log('Creating clinics...');
    const createdClinics = await Clinic.create(clinics);
    console.log(`Created ${createdClinics.length} clinics`);

    // Create doctors
    console.log('Creating doctors...');
    const doctors = [
      {
        name: 'Dr. Sarah Johnson',
        specialty: 'Cardiology',
        qualification: 'MD, FACC',
        experience: 15,
        clinic: createdClinics[0]._id,
        email: 'sarah.johnson@citygeneralhospital.com',
        phone: '+1-555-0201',
        rating: 4.8
      },
      {
        name: 'Dr. Michael Chen',
        specialty: 'Orthopedics',
        qualification: 'MD, FAAOS',
        experience: 12,
        clinic: createdClinics[0]._id,
        email: 'michael.chen@citygeneralhospital.com',
        phone: '+1-555-0202',
        rating: 4.6
      },
      {
        name: 'Dr. Emily Williams',
        specialty: 'Pediatrics',
        qualification: 'MD, FAAP',
        experience: 10,
        clinic: createdClinics[0]._id,
        email: 'emily.williams@citygeneralhospital.com',
        phone: '+1-555-0203',
        rating: 4.9
      },
      {
        name: 'Dr. Robert Davis',
        specialty: 'Family Medicine',
        qualification: 'MD, AAFP',
        experience: 8,
        clinic: createdClinics[1]._id,
        email: 'robert.davis@sunrisemedical.com',
        phone: '+1-555-0204',
        rating: 4.7
      },
      {
        name: 'Dr. Lisa Martinez',
        specialty: 'Dermatology',
        qualification: 'MD, FAAD',
        experience: 14,
        clinic: createdClinics[1]._id,
        email: 'lisa.martinez@sunrisemedical.com',
        phone: '+1-555-0205',
        rating: 4.8
      },
      {
        name: 'Dr. James Wilson',
        specialty: 'General Practice',
        qualification: 'MD',
        experience: 20,
        clinic: createdClinics[2]._id,
        email: 'james.wilson@greenvalleyclinic.com',
        phone: '+1-555-0206',
        rating: 4.5
      }
    ];

    const createdDoctors = await Doctor.create(doctors);
    console.log(`Created ${createdDoctors.length} doctors`);

    // Create schedules
    console.log('Creating schedules...');
    const schedules = [];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    
    createdDoctors.forEach((doctor) => {
      days.forEach((day) => {
        schedules.push({
          doctor: doctor._id,
          clinic: doctor.clinic,
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '17:00',
          slotDuration: 30,
          isActive: true
        });
      });
    });

    const createdSchedules = await Schedule.create(schedules);
    console.log(`Created ${createdSchedules.length} schedules`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\nSample Login Credentials:');
    console.log('User: john@example.com / password123');
    console.log('User: jane@example.com / password123');
    console.log('Admin: admin@example.com / admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
