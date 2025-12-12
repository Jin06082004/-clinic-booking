require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');

const User = require('./models/User');
const Clinic = require('./models/Clinic');
const Doctor = require('./models/Doctor');
const Schedule = require('./models/Schedule');
const Booking = require('./models/Booking');

// Dữ liệu mẫu
const users = [
  {
    name: 'Nguyễn Văn An',
    email: 'nguyenvanan@example.com',
    password: 'password123',
    phone: '0901234567',
    role: 'user'
  },
  {
    name: 'Trần Thị Bình',
    email: 'tranthibinh@example.com',
    password: 'password123',
    phone: '0902345678',
    role: 'user'
  },
  {
    name: 'Quản Trị Viên',
    email: 'admin@example.com',
    password: 'admin123',
    phone: '0903456789',
    role: 'admin'
  }
];

const clinics = [
  {
    name: 'Bệnh Viện Đa Khoa Thành Phố',
    description: 'Bệnh viện đa khoa hàng đầu với đầy đủ trang thiết bị hiện đại và đội ngũ bác sĩ giàu kinh nghiệm, cung cấp dịch vụ y tế chất lượng cao.',
    address: '123 Nguyễn Huệ',
    city: 'Hồ Chí Minh',
    phone: '028-3822-1234',
    email: 'lienhe@bvdktphcm.vn',
    specialties: ['Tim Mạch', 'Chấn Thương Chỉnh Hình', 'Nhi Khoa', 'Đa Khoa'],
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800'
  },
  {
    name: 'Phòng Khám Đa Khoa Sài Gòn',
    description: 'Phòng khám hiện đại chuyên về chăm sóc sức khỏe ban đầu và y học dự phòng với phương châm bệnh nhân là trung tâm.',
    address: '456 Lê Lợi',
    city: 'Hà Nội',
    phone: '024-3826-5678',
    email: 'info@phongkhamsaigon.vn',
    specialties: ['Y Học Gia Đình', 'Nội Khoa', 'Da Liễu'],
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800'
  },
  {
    name: 'Phòng Khám Bác Sĩ Gia Đình',
    description: 'Phòng khám cộng đồng cung cấp dịch vụ y tế chất lượng với chi phí hợp lý, dễ tiếp cận cho mọi người.',
    address: '789 Trần Hưng Đạo',
    city: 'Đà Nẵng',
    phone: '0236-3567-890',
    email: 'lienhe@bacsigiadinh.vn',
    specialties: ['Khám Bệnh Tổng Quát', 'Nhi Khoa', 'Phụ Sản'],
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800'
  },
  {
    name: 'Bệnh Viện Mắt Quốc Tế',
    description: 'Bệnh viện chuyên khoa mắt hàng đầu với công nghệ laser hiện đại và đội ngũ bác sĩ giỏi, chuyên điều trị các bệnh về mắt.',
    address: '234 Võ Văn Tần',
    city: 'Hồ Chí Minh',
    phone: '028-3829-1234',
    email: 'info@bvmatquocte.vn',
    specialties: ['Nhãn Khoa', 'Phẫu Thuật Mắt', 'Khúc Xạ'],
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800'
  },
  {
    name: 'Trung Tâm Y Tế Đại Học',
    description: 'Trung tâm y tế kết hợp giữa nghiên cứu và thực hành lâm sàng, cung cấp dịch vụ y tế toàn diện với chi phí hợp lý.',
    address: '567 Điện Biên Phủ',
    city: 'Hà Nội',
    phone: '024-3828-9876',
    email: 'contact@ytdaihoc.edu.vn',
    specialties: ['Nội Khoa', 'Ngoại Khoa', 'Sản Phụ Khoa', 'Tai Mũi Họng'],
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?w=800'
  },
  {
    name: 'Phòng Khám Răng Hàm Mặt Smile',
    description: 'Phòng khám nha khoa hiện đại với trang thiết bị tiên tiến, chuyên về implant, niềng răng và thẩm mỹ nha khoa.',
    address: '890 Hai Bà Trưng',
    city: 'Đà Nẵng',
    phone: '0236-3888-999',
    email: 'smile@ranghammat.vn',
    specialties: ['Nha Khoa', 'Implant', 'Niềng Răng', 'Thẩm Mỹ Răng'],
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800'
  },
  {
    name: 'Bệnh Viện Tim Mạch',
    description: 'Bệnh viện chuyên sâu về tim mạch với phòng cấp cứu 24/7 và hệ thống can thiệp tim mạch hiện đại nhất.',
    address: '101 Lý Thường Kiệt',
    city: 'Hồ Chí Minh',
    phone: '028-3830-5555',
    email: 'timmach@bvtm.vn',
    specialties: ['Tim Mạch', 'Can Thiệp Tim Mạch', 'Phẫu Thuật Tim'],
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800'
  },
  {
    name: 'Phòng Khám Đông Y Truyền Thống',
    description: 'Phòng khám kết hợp đông y và tây y, chuyên điều trị các bệnh mãn tính và phục hồi chức năng.',
    address: '321 Phan Đình Phùng',
    city: 'Hà Nội',
    phone: '024-3945-6789',
    email: 'dongytruyen thong@gmail.com',
    specialties: ['Đông Y', 'Châm Cứu', 'Phục Hồi Chức Năng'],
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=800'
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

    // Create receptionists
    console.log('Creating receptionists...');
    const receptionists = [
      {
        name: 'Lê Thị Mai',
        email: 'lethimai@example.com',
        password: 'receptionist123',
        phone: '0904567890',
        role: 'receptionist',
        clinic: createdClinics[0]._id
      },
      {
        name: 'Phạm Văn Hùng',
        email: 'phamvanhung@example.com',
        password: 'receptionist123',
        phone: '0905678901',
        role: 'receptionist',
        clinic: createdClinics[1]._id
      },
      {
        name: 'Hoàng Thị Lan',
        email: 'hoangthilan@example.com',
        password: 'receptionist123',
        phone: '0906789012',
        role: 'receptionist',
        clinic: createdClinics[2]._id
      },
      {
        name: 'Nguyễn Văn Đức',
        email: 'nguyenvanduc@example.com',
        password: 'receptionist123',
        phone: '0907890123',
        role: 'receptionist',
        clinic: createdClinics[3]._id
      },
      {
        name: 'Trần Thị Hoa',
        email: 'tranthihoa@example.com',
        password: 'receptionist123',
        phone: '0908901234',
        role: 'receptionist',
        clinic: createdClinics[4]._id
      },
      {
        name: 'Võ Minh Tuấn',
        email: 'vominhtuan@example.com',
        password: 'receptionist123',
        phone: '0909012345',
        role: 'receptionist',
        clinic: createdClinics[5]._id
      },
      {
        name: 'Đỗ Thị Nga',
        email: 'dothinga@example.com',
        password: 'receptionist123',
        phone: '0910123456',
        role: 'receptionist',
        clinic: createdClinics[6]._id
      },
      {
        name: 'Bùi Văn Tài',
        email: 'buivantai@example.com',
        password: 'receptionist123',
        phone: '0911234567',
        role: 'receptionist',
        clinic: createdClinics[7]._id
      }
    ];

    const createdReceptionists = await User.create(receptionists);
    console.log(`Created ${createdReceptionists.length} receptionists`);

    // Create doctors
    console.log('Creating doctors...');
    const doctors = [
      // Bệnh Viện Đa Khoa Thành Phố
      {
        name: 'BS. Nguyễn Thị Thu Hà',
        specialty: 'Tim Mạch',
        qualification: 'Bác sĩ chuyên khoa II',
        experience: 15,
        clinic: createdClinics[0]._id,
        email: 'bs.thuha@bvdktphcm.vn',
        phone: '028-3822-1235',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400'
      },
      {
        name: 'BS. Trần Minh Tuấn',
        specialty: 'Chấn Thương Chỉnh Hình',
        qualification: 'Thạc sĩ, Bác sĩ',
        experience: 12,
        clinic: createdClinics[0]._id,
        email: 'bs.minhtuan@bvdktphcm.vn',
        phone: '028-3822-1236',
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400'
      },
      {
        name: 'BS. Lê Thị Hương',
        specialty: 'Nhi Khoa',
        qualification: 'Bác sĩ chuyên khoa I',
        experience: 10,
        clinic: createdClinics[0]._id,
        email: 'bs.thihuong@bvdktphcm.vn',
        phone: '028-3822-1237',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400'
      },
      {
        name: 'BS. Hoàng Văn Minh',
        specialty: 'Đa Khoa',
        qualification: 'Bác sĩ Đa Khoa',
        experience: 8,
        clinic: createdClinics[0]._id,
        email: 'bs.vanminh@bvdktphcm.vn',
        phone: '028-3822-1238',
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400'
      },
      
      // Phòng Khám Đa Khoa Sài Gòn
      {
        name: 'BS. Phạm Văn Nam',
        specialty: 'Y Học Gia Đình',
        qualification: 'Bác sĩ Đa Khoa',
        experience: 8,
        clinic: createdClinics[1]._id,
        email: 'bs.vannam@phongkhamsaigon.vn',
        phone: '024-3826-5679',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400'
      },
      {
        name: 'BS. Võ Thị Lan Anh',
        specialty: 'Da Liễu',
        qualification: 'Bác sĩ chuyên khoa I',
        experience: 14,
        clinic: createdClinics[1]._id,
        email: 'bs.lananh@phongkhamsaigon.vn',
        phone: '024-3826-5680',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=400'
      },
      {
        name: 'BS. Nguyễn Quốc Khánh',
        specialty: 'Nội Khoa',
        qualification: 'Tiến sĩ, Bác sĩ chuyên khoa II',
        experience: 18,
        clinic: createdClinics[1]._id,
        email: 'bs.quockhanh@phongkhamsaigon.vn',
        phone: '024-3826-5681',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400'
      },
      
      // Phòng Khám Bác Sĩ Gia Đình
      {
        name: 'BS. Đặng Quốc Huy',
        specialty: 'Khám Bệnh Tổng Quát',
        qualification: 'Bác sĩ Đa Khoa',
        experience: 20,
        clinic: createdClinics[2]._id,
        email: 'bs.quochuy@bacsigiadinh.vn',
        phone: '0236-3567-891',
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=400'
      },
      {
        name: 'BS. Trần Thị Minh Châu',
        specialty: 'Nhi Khoa',
        qualification: 'Bác sĩ chuyên khoa I',
        experience: 11,
        clinic: createdClinics[2]._id,
        email: 'bs.minhchau@bacsigiadinh.vn',
        phone: '0236-3567-892',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400'
      },
      {
        name: 'BS. Lê Văn Tùng',
        specialty: 'Phụ Sản',
        qualification: 'Thạc sĩ, Bác sĩ',
        experience: 16,
        clinic: createdClinics[2]._id,
        email: 'bs.vantung@bacsigiadinh.vn',
        phone: '0236-3567-893',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400'
      },
      
      // Bệnh Viện Mắt Quốc Tế
      {
        name: 'BS. CKI. Phan Thị Ngọc',
        specialty: 'Nhãn Khoa',
        qualification: 'Bác sĩ chuyên khoa I',
        experience: 13,
        clinic: createdClinics[3]._id,
        email: 'bs.thingoc@bvmatquocte.vn',
        phone: '028-3829-1235',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=400'
      },
      {
        name: 'BS. CKII. Nguyễn Văn Đông',
        specialty: 'Phẫu Thuật Mắt',
        qualification: 'Tiến sĩ, Bác sĩ chuyên khoa II',
        experience: 22,
        clinic: createdClinics[3]._id,
        email: 'bs.vandong@bvmatquocte.vn',
        phone: '028-3829-1236',
        rating: 5.0,
        image: 'https://images.unsplash.com/photo-1612531386530-97286d97c2d1?w=400'
      },
      {
        name: 'BS. Trương Minh Hải',
        specialty: 'Khúc Xạ',
        qualification: 'Bác sĩ chuyên khoa I',
        experience: 9,
        clinic: createdClinics[3]._id,
        email: 'bs.minhhai@bvmatquocte.vn',
        phone: '028-3829-1237',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1589758438368-0ad531db3366?w=400'
      },
      
      // Trung Tâm Y Tế Đại Học
      {
        name: 'PGS.TS. Lê Thị Kim Oanh',
        specialty: 'Nội Khoa',
        qualification: 'Phó Giáo sư, Tiến sĩ',
        experience: 25,
        clinic: createdClinics[4]._id,
        email: 'pgs.kimoanh@ytdaihoc.edu.vn',
        phone: '024-3828-9877',
        rating: 5.0,
        image: 'https://images.unsplash.com/photo-1651008376811-b98baee60c1f?w=400'
      },
      {
        name: 'BS. Vũ Hoàng Long',
        specialty: 'Ngoại Khoa',
        qualification: 'Bác sĩ chuyên khoa II',
        experience: 17,
        clinic: createdClinics[4]._id,
        email: 'bs.hoanglong@ytdaihoc.edu.vn',
        phone: '024-3828-9878',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=400'
      },
      {
        name: 'BS. Đinh Thị Thanh Huyền',
        specialty: 'Sản Phụ Khoa',
        qualification: 'Thạc sĩ, Bác sĩ',
        experience: 14,
        clinic: createdClinics[4]._id,
        email: 'bs.thanhhuyen@ytdaihoc.edu.vn',
        phone: '024-3828-9879',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1643297654416-05795d62e39c?w=400'
      },
      {
        name: 'BS. Bùi Văn Cường',
        specialty: 'Tai Mũi Họng',
        qualification: 'Bác sĩ chuyên khoa I',
        experience: 12,
        clinic: createdClinics[4]._id,
        email: 'bs.vancuong@ytdaihoc.edu.vn',
        phone: '024-3828-9880',
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1609743522653-52354461eb27?w=400'
      },
      
      // Phòng Khám Răng Hàm Mặt Smile
      {
        name: 'BS. Nha khoa Nguyễn Thị Xuân',
        specialty: 'Nha Khoa',
        qualification: 'Bác sĩ chuyên khoa I',
        experience: 10,
        clinic: createdClinics[5]._id,
        email: 'bs.thixuan@ranghammat.vn',
        phone: '0236-3888-991',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?w=400'
      },
      {
        name: 'BS. Phạm Minh Đức',
        specialty: 'Implant',
        qualification: 'Thạc sĩ, Bác sĩ',
        experience: 15,
        clinic: createdClinics[5]._id,
        email: 'bs.minhduc@ranghammat.vn',
        phone: '0236-3888-992',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1618498082410-b4aa22193b38?w=400'
      },
      {
        name: 'BS. Lý Thị Mai Anh',
        specialty: 'Niềng Răng',
        qualification: 'Bác sĩ chuyên khoa I',
        experience: 8,
        clinic: createdClinics[5]._id,
        email: 'bs.maianh@ranghammat.vn',
        phone: '0236-3888-993',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1629909615205-79e87a737641?w=400'
      },
      
      // Bệnh Viện Tim Mạch
      {
        name: 'GS.TS. Trần Quốc Tuấn',
        specialty: 'Tim Mạch',
        qualification: 'Giáo sư, Tiến sĩ',
        experience: 30,
        clinic: createdClinics[6]._id,
        email: 'gs.quoctuan@bvtm.vn',
        phone: '028-3830-5556',
        rating: 5.0,
        image: 'https://images.unsplash.com/photo-1612349316228-5942a9b489c2?w=400'
      },
      {
        name: 'BS. Nguyễn Thị Hồng Nhung',
        specialty: 'Can Thiệp Tim Mạch',
        qualification: 'Bác sĩ chuyên khoa II',
        experience: 16,
        clinic: createdClinics[6]._id,
        email: 'bs.hongnhung@bvtm.vn',
        phone: '028-3830-5557',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400'
      },
      {
        name: 'BS. Lê Hoàng Nam',
        specialty: 'Phẫu Thuật Tim',
        qualification: 'Tiến sĩ, Bác sĩ chuyên khoa II',
        experience: 19,
        clinic: createdClinics[6]._id,
        email: 'bs.hoangnam@bvtm.vn',
        phone: '028-3830-5558',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=400'
      },
      
      // Phòng Khám Đông Y Truyền Thống
      {
        name: 'Lương Y Võ Văn Thành',
        specialty: 'Đông Y',
        qualification: 'Lương y',
        experience: 28,
        clinic: createdClinics[7]._id,
        email: 'ly.vanthanh@dongytruyen thong.com',
        phone: '024-3945-6791',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1618846166896-9c93b47c5b50?w=400'
      },
      {
        name: 'BS. Đỗ Thị Hằng',
        specialty: 'Châm Cứu',
        qualification: 'Bác sĩ Y học cổ truyền',
        experience: 12,
        clinic: createdClinics[7]._id,
        email: 'bs.thihang@dongytruyen thong.com',
        phone: '024-3945-6792',
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400'
      },
      {
        name: 'BS. Nguyễn Văn Bình',
        specialty: 'Phục Hồi Chức Năng',
        qualification: 'Bác sĩ chuyên khoa I',
        experience: 10,
        clinic: createdClinics[7]._id,
        email: 'bs.vanbinh@dongytruyen thong.com',
        phone: '024-3945-6793',
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1612531390369-9399b1fc7a64?w=400'
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

    console.log('\n✅ Khởi tạo cơ sở dữ liệu thành công!');
    console.log('\nThông tin đăng nhập mẫu:');
    console.log('Người dùng: nguyenvanan@example.com / password123');
    console.log('Người dùng: tranthibinh@example.com / password123');
    console.log('\nLễ tân:');
    console.log('- lethimai@example.com / receptionist123 (Bệnh Viện Đa Khoa TP)');
    console.log('- phamvanhung@example.com / receptionist123 (PK Đa Khoa Sài Gòn)');
    console.log('- hoangthilan@example.com / receptionist123 (PK Bác Sĩ Gia Đình)');
    console.log('- nguyenvanduc@example.com / receptionist123 (BV Mắt Quốc Tế)');
    console.log('- tranthihoa@example.com / receptionist123 (TT Y Tế Đại Học)');
    console.log('- vominhtuan@example.com / receptionist123 (PK Răng Hàm Mặt)');
    console.log('- dothinga@example.com / receptionist123 (BV Tim Mạch)');
    console.log('- buivantai@example.com / receptionist123 (PK Đông Y)');
    console.log('\nQuản trị: admin@example.com / admin123');
    console.log(`\nĐã tạo:`);
    console.log(`- ${createdClinics.length} phòng khám/bệnh viện`);
    console.log(`- ${createdDoctors.length} bác sĩ`);
    console.log(`- ${createdSchedules.length} lịch khám`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
