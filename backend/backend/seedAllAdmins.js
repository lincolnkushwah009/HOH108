const mongoose = require('mongoose');
require('dotenv').config();

// Import User model
const User = require('./models/User');

// Admin users for all verticals
const adminUsers = [
  {
    fullName: 'Super Admin',
    email: 'superadmin@hoh108.com',
    phone: '9999999999',
    password: 'admin123',
    role: 'super_admin',
    verticals: ['interior', 'construction', 'renovation', 'on_demand'],
    permissions: [
      'view_users', 'create_users', 'edit_users', 'delete_users',
      'view_employees', 'create_employees', 'edit_employees', 'delete_employees',
      'view_customers', 'create_customers', 'edit_customers', 'delete_customers',
      'view_projects', 'create_projects', 'edit_projects', 'delete_projects',
      'view_designs', 'create_designs', 'edit_designs', 'delete_designs', 'approve_designs',
      'view_dashboard', 'manage_roles', 'manage_permissions'
    ],
    status: 'active',
    isActive: true
  },
  {
    fullName: 'Interior Admin',
    email: 'interior@hoh108.com',
    phone: '9999999991',
    password: 'interior123',
    role: 'interior_admin',
    serviceType: 'interior',
    verticals: ['interior'],
    permissions: [
      'view_employees', 'create_employees', 'edit_employees',
      'view_customers', 'create_customers', 'edit_customers',
      'view_projects', 'create_projects', 'edit_projects',
      'view_designs', 'create_designs', 'edit_designs', 'approve_designs',
      'view_dashboard'
    ],
    status: 'active',
    isActive: true
  },
  {
    fullName: 'Construction Admin',
    email: 'construction@hoh108.com',
    phone: '9999999992',
    password: 'construction123',
    role: 'construction_admin',
    serviceType: 'construction',
    verticals: ['construction'],
    permissions: [
      'view_employees', 'create_employees', 'edit_employees',
      'view_customers', 'create_customers', 'edit_customers',
      'view_projects', 'create_projects', 'edit_projects',
      'view_dashboard'
    ],
    status: 'active',
    isActive: true
  },
  {
    fullName: 'Renovation Admin',
    email: 'renovation@hoh108.com',
    phone: '9999999993',
    password: 'renovation123',
    role: 'renovation_admin',
    serviceType: 'renovation',
    verticals: ['renovation'],
    permissions: [
      'view_employees', 'create_employees', 'edit_employees',
      'view_customers', 'create_customers', 'edit_customers',
      'view_projects', 'create_projects', 'edit_projects',
      'view_dashboard'
    ],
    status: 'active',
    isActive: true
  },
  {
    fullName: 'On-Demand Admin',
    email: 'ondemand@hoh108.com',
    phone: '9999999994',
    password: 'ondemand123',
    role: 'on_demand_admin',
    serviceType: 'on_demand',
    verticals: ['on_demand'],
    permissions: [
      'view_employees', 'create_employees', 'edit_employees',
      'view_customers', 'create_customers', 'edit_customers',
      'view_dashboard'
    ],
    status: 'active',
    isActive: true
  }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hoh108')
  .then(() => {
    console.log('✅ Connected to MongoDB');
    seedAllAdmins();
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

async function seedAllAdmins() {
  try {
    console.log('\n🚀 Starting admin user seeding...\n');

    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const adminData of adminUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: adminData.email });

      if (existingUser) {
        // Delete and recreate to ensure correct password
        await User.deleteOne({ email: adminData.email });
        console.log(`🗑️  Deleted existing user: ${adminData.email}`);
        updated++;
      } else {
        created++;
      }

      // Create user (password will be hashed by pre-save hook)
      const user = await User.create(adminData);
      console.log(`✅ Created: ${user.fullName} (${user.email}) - Role: ${user.role}`);
    }

    console.log('\n' + '='.repeat(80));
    console.log('📊 Summary:');
    console.log(`   Created: ${created} new users`);
    console.log(`   Updated: ${updated} existing users`);
    console.log(`   Total: ${adminUsers.length} admin accounts ready`);
    console.log('='.repeat(80));

    console.log('\n🔑 Login Credentials:\n');
    console.log('┌─────────────────────┬──────────────────────────┬─────────────────┐');
    console.log('│ Role                │ Email                    │ Password        │');
    console.log('├─────────────────────┼──────────────────────────┼─────────────────┤');
    console.log('│ Super Admin         │ superadmin@hoh108.com    │ admin123        │');
    console.log('│ Interior Admin      │ interior@hoh108.com      │ interior123     │');
    console.log('│ Construction Admin  │ construction@hoh108.com  │ construction123 │');
    console.log('│ Renovation Admin    │ renovation@hoh108.com    │ renovation123   │');
    console.log('│ On-Demand Admin     │ ondemand@hoh108.com      │ ondemand123     │');
    console.log('└─────────────────────┴──────────────────────────┴─────────────────┘');

    console.log('\n🌐 Admin Panel: http://localhost:5173/admin-login');
    console.log('\n✨ All admin accounts are ready to use!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}
