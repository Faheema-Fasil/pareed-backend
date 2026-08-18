import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/user.model.js';
import Product from '../models/product.model.js';
import Service from '../models/service.model.js';
import TeamMember from '../models/team.model.js';
import WhyChooseUs from '../models/whyChooseUs.model.js';
import Inquiry from '../models/inquiry.model.js';
import Setting from '../models/setting.model.js';

dotenv.config();

const initialProducts = [
  {
    number: '01',
    name: 'King Fish',
    sub: 'Seer Fish',
    description:
      'Premium quality king fish presented in a clean chilled setting, suitable for commercial seafood supply.',
    image:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=80',
    order: 0,
  },
  {
    number: '02',
    name: 'Hamour',
    sub: 'Grouper / Reef Cod',
    description:
      'Popular local favorite valued for white, flaky meat and mild flavor across restaurants and hotels.',
    image:
      'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=900&q=80',
    order: 1,
  },
  {
    number: '03',
    name: 'White Pomfret',
    sub: 'Silver Pomfret',
    description:
      'Highly sought-after commercial fish known for tender texture, exquisite freshness and delicate taste.',
    image:
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=80',
    order: 2,
  },
  {
    number: '04',
    name: 'Tiger Prawns',
    sub: 'Jumbo Prawns',
    description:
      'Freshly harvested, sorted and graded tiger prawns ideal for bulk commercial buyers and caterers.',
    image:
      'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=900&q=80',
    order: 3,
  },
  {
    number: '05',
    name: 'Atlantic Salmon',
    sub: 'Fresh Chilled Salmon',
    description:
      'Premium whole and cut salmon chilled under strict temperature standards for restaurants and retail.',
    image:
      'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=900&q=80',
    order: 4,
  },
];

const initialServices = [
  {
    number: '01',
    title: 'Wholesale Seafood Supply',
    description:
      'Direct sourcing and reliable bulk supply tailored for supermarkets, commercial kitchens, catering operations and hospitality clients.',
    image:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=80',
    order: 0,
  },
  {
    number: '02',
    title: 'Fresh Fish Supply',
    description:
      'Carefully selected fresh fish with a focus on quality, freshness and consistency.',
    image:
      'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?auto=format&fit=crop&w=900&q=80',
    order: 1,
  },
  {
    number: '03',
    title: 'Reliable Distribution',
    description:
      'Dependable seafood supply solutions designed around your business requirements.',
    image:
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=80',
    order: 2,
  },
];

const initialTeam = [
  {
    name: 'Pareed Kunnumpuram',
    role: 'CEO & FOUNDER',
    initials: 'PK',
    photo: '',
    order: 0,
  },
  {
    name: 'Ubais Kunnumpuram',
    role: 'MANAGING DIRECTOR',
    initials: 'UK',
    photo: '',
    order: 1,
  },
  {
    name: 'Aliyar Pattachalil',
    role: 'GENERAL MANAGER',
    initials: 'AP',
    photo: '',
    order: 2,
  },
];

const initialWhyChooseUs = [
  {
    number: '01',
    title: 'Freshness',
    description: 'Quality-focused sourcing and handling.',
    order: 0,
  },
  {
    number: '02',
    title: 'Reliability',
    description: 'Consistent wholesale supply.',
    order: 1,
  },
  {
    number: '03',
    title: 'Quality',
    description: 'Premium seafood selected with care.',
    order: 2,
  },
  {
    number: '04',
    title: 'Flexibility',
    description: 'Supply solutions based on business requirements.',
    order: 3,
  },
  {
    number: '05',
    title: 'Service',
    description: 'Responsive support from enquiry to delivery.',
    order: 4,
  },
];

const initialInquiries = [
  {
    name: 'Rashid Al Nuaimi',
    company: 'Emirates Seafood Grill LLC',
    phone: '+971 50 123 4567',
    email: 'rashid@emiratesgrill.ae',
    business: 'Restaurant',
    requirement: 'Fresh Fish',
    message:
      'Looking for a daily delivery of 50kg fresh King Fish and Hamour for our branch in Deira.',
    status: 'New',
  },
  {
    name: 'Sarah Jenkins',
    company: 'Marina Waterfront Bistro',
    phone: '+971 55 987 6543',
    email: 's.jenkins@marinabistro.com',
    business: 'Hotel / Restaurant',
    requirement: 'Bulk Order',
    message:
      'Need wholesale price list for Salmon, Pomfret and Jumbo Tiger Prawns.',
    status: 'Contacted',
  },
  {
    name: 'Mohammed Tariq',
    company: 'Prime Mart Supermarkets',
    phone: '+971 52 444 8899',
    email: 'procurement@primemart.ae',
    business: 'Supermarket',
    requirement: 'Regular Supply',
    message:
      'We operate 4 supermarkets across Sharjah & Dubai and are evaluating seafood supply contracts.',
    status: 'In Progress',
  },
];

const initialSettings = [
  {
    key: 'general',
    data: {
      logoImageUrl: '/PAREED FISH TRADING L.L.C 2026.png',
      phone1: '+971 50 181 1875',
      phone2: '+971 50 602 7334',
      email: 'info@pareedfishtrading.com',
      location: 'Waterfront Market',
      cityCountry: 'Dubai, United Arab Emirates',
    },
  },
  {
    key: 'hero',
    data: {
      preheading: 'DUBAI SEAFOOD WHOLESALE • EST. 1990',
      headingLine1: 'Fresh seafood,',
      headingLine2: 'reliably delivered.',
      description:
        'Connecting commercial kitchens, restaurants and bulk buyers with quality fresh fish across the UAE.',
      yearsBadge: '35+',
      yearsText: 'Years of Market Experience in the UAE',
      primaryCtaText: 'ENQUIRE FOR SUPPLY →',
      primaryCtaLink: '#contact',
      secondaryCtaText: 'VIEW PRODUCTS',
      secondaryCtaLink: '#products',
      bgImageUrl: '',
    },
  },
  {
    key: 'about',
    data: {
      preheading: 'ABOUT PAREED FISH TRADING',
      headingLine1: 'Over three decades of trusted',
      headingLine2: 'seafood supply in the UAE.',
      description1:
        'Established in the United Arab Emirates, Pareed Fish Trading LLC has grown from a dedicated market presence into a trusted wholesale partner for food businesses across the region.',
      description2:
        'Built on personal relationships, deep market knowledge and a commitment to daily freshness, we take pride in connecting customers with the finest catch every single morning.',
      experienceYears: '35+',
      experienceText: 'Years in Seafood Trade',
      establishedYear: '1990',
      imageUrl: '',
    },
  },
];

const seedData = async () => {
  try {
    await connectDB();

    console.log('[Seeder] Clearing old data...');
    await Promise.all([
      User.deleteMany({ email: 'admin@pareed.com' }),
      Product.deleteMany({}),
      Service.deleteMany({}),
      TeamMember.deleteMany({}),
      WhyChooseUs.deleteMany({}),
      Inquiry.deleteMany({}),
      Setting.deleteMany({}),
    ]);

    console.log('[Seeder] Creating admin account...');
    await User.create({
      name: 'Pareed Administrator',
      email: 'admin@pareed.com',
      password: 'adminpassword123',
      role: 'admin',
    });

    console.log('[Seeder] Seeding products...');
    await Product.insertMany(initialProducts);

    console.log('[Seeder] Seeding services...');
    await Service.insertMany(initialServices);

    console.log('[Seeder] Seeding team...');
    await TeamMember.insertMany(initialTeam);

    console.log('[Seeder] Seeding why choose us...');
    await WhyChooseUs.insertMany(initialWhyChooseUs);

    console.log('[Seeder] Seeding sample inquiries...');
    await Inquiry.insertMany(initialInquiries);

    console.log('[Seeder] Seeding website settings...');
    await Setting.insertMany(initialSettings);

    console.log('✅ [Seeder] Database successfully seeded with default Pareed data!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ [Seeder Error] ${error.message}`);
    process.exit(1);
  }
};

seedData();
