const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/database');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const Product = require('../models/Product');
const User = require('../models/User');

dotenv.config();

const categories = [
  { 
    name: 'Full Face Helmets', 
    slug: 'full-face-helmets',
    description: 'Maximum protection for riders',
    isActive: true
  },
  { 
    name: 'Modular Helmets', 
    slug: 'modular-helmets',
    description: 'Flip-up design for versatility',
    isActive: true
  },
  { 
    name: 'Half Helmets', 
    slug: 'half-helmets',
    description: 'Lightweight and comfortable',
    isActive: true
  },
  { 
    name: 'Off-Road Helmets', 
    slug: 'off-road-helmets',
    description: 'Built for adventure',
    isActive: true
  },
];

const brands = [
  { 
    name: 'Shoei', 
    slug: 'shoei',
    description: 'Premium Japanese helmet manufacturer',
    isActive: true
  },
  { 
    name: 'AGV', 
    slug: 'agv',
    description: 'Italian racing heritage',
    isActive: true
  },
  { 
    name: 'HJC', 
    slug: 'hjc',
    description: 'Quality helmets at affordable prices',
    isActive: true
  },
  { 
    name: 'Arai', 
    slug: 'arai',
    description: 'Handcrafted perfection',
    isActive: true
  },
  { 
    name: 'Bell', 
    slug: 'bell',
    description: 'American innovation since 1954',
    isActive: true
  },
];

const products = [
  {
    name: 'Shoei RF-1400',
    slug: 'shoei-rf-1400',
    description: 'Premium full-face helmet with advanced aerodynamics and ventilation system. Features multi-density EPS liner and emergency quick-release system.',
    price: 15999,
    stock: 25,
    weight: 1650,
    images: [
      { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', publicId: 'sample1' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Red'],
    features: ['DOT Certified', 'ECE 22.06', 'Pinlock Ready', 'Emergency Quick Release'],
    isActive: true,
  },
  {
    name: 'AGV K6',
    slug: 'agv-k6',
    description: 'Racing-inspired full-face helmet with carbon-aramid-fiberglass shell. MotoGP-derived aerodynamics and superior ventilation.',
    price: 18999,
    stock: 15,
    weight: 1350,
    images: [
      { url: 'https://images.unsplash.com/photo-1590740008072-56d7d5b46971?w=800', publicId: 'sample2' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'Blue', 'Yellow'],
    features: ['DOT Certified', 'ECE 22.06', 'Aerodynamic Shell', 'Race-Proven'],
    isActive: true,
  },
  {
    name: 'HJC i90',
    slug: 'hjc-i90',
    description: 'Modular helmet with flip-up design. Perfect for touring with sun visor and Bluetooth compatibility.',
    price: 12999,
    stock: 30,
    weight: 1850,
    images: [
      { url: 'https://images.unsplash.com/photo-1558617114-d25f8e20d917?w=800', publicId: 'sample3' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Matte Black', 'Silver', 'White'],
    features: ['DOT Certified', 'Flip-Up Design', 'Sun Visor', 'Bluetooth Ready'],
    isActive: true,
  },
  {
    name: 'Bell Moto-9S Flex',
    slug: 'bell-moto-9s-flex',
    description: 'Off-road helmet with Flex liner technology for superior impact absorption. Lightweight carbon shell construction.',
    price: 21999,
    stock: 10,
    weight: 1400,
    images: [
      { url: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800', publicId: 'sample4' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Orange', 'Green'],
    features: ['DOT Certified', 'Carbon Shell', 'Flex Technology', 'Off-Road Optimized'],
    isActive: true,
  },
  {
    name: 'Arai Corsair-X',
    slug: 'arai-corsair-x',
    description: 'Handcrafted racing helmet with complex laminate construction. Exceptional fit and finish.',
    price: 24999,
    stock: 8,
    weight: 1550,
    images: [
      { url: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800', publicId: 'sample5' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Red/Black'],
    features: ['Snell M2020', 'Handcrafted', 'Complex Laminate', 'Race Ready'],
    isActive: true,
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('🗑️  Clearing existing data...');
    await Category.deleteMany();
    await Brand.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('📁 Creating categories...');
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    console.log('🏷️  Creating brands...');
    const createdBrands = await Brand.insertMany(brands);
    console.log(`✅ Created ${createdBrands.length} brands`);

    console.log('🛍️  Creating products...');
    const productsWithRefs = products.map((product, index) => ({
      ...product,
      category: createdCategories[index % createdCategories.length]._id,
      brand: createdBrands[index % createdBrands.length]._id,
    }));
    const createdProducts = await Product.insertMany(productsWithRefs);
    console.log(`✅ Created ${createdProducts.length} products`);

    console.log('👤 Creating admin user...');
    await User.create({
      name: 'Admin User',
      email: 'admin@aegisgear.com',
      password: 'Admin@123456',
      role: 'admin',
    });
    console.log('✅ Admin user created');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Categories: ${createdCategories.length}`);
    console.log(`   - Brands: ${createdBrands.length}`);
    console.log(`   - Products: ${createdProducts.length}`);
    console.log(`   - Admin user: 1`);
    console.log('\n👤 Admin Login:');
    console.log('   Email: admin@aegisgear.com');
    console.log('   Password: Admin@123456\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
};

seedDatabase();
