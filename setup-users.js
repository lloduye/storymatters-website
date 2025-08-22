const bcrypt = require('bcryptjs');

// Function to hash a password
async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Sample users data
const users = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@cms.com',
    password: 'admin123', // This will be hashed
    fullName: 'Admin User',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: '2024-01-01T00:00:00Z',
    permissions: 'all',
    phone: '+254700000000',
    department: 'Management',
    notes: 'Main admin user'
  },
  {
    id: '2',
    username: 'editor1',
    email: 'editor1@cms.com',
    password: 'editor123', // This will be hashed
    fullName: 'John Editor',
    role: 'editor',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: '2024-01-01T00:00:00Z',
    permissions: 'content',
    phone: '+254700000001',
    department: 'Content',
    notes: 'Content editor'
  }
];

// Main function to generate hashed passwords
async function generateUserSetup() {
  console.log('Setting up users with bcrypt-hashed passwords...\n');
  
  for (const user of users) {
    const hashedPassword = await hashPassword(user.password);
    
    console.log(`User: ${user.username} (${user.role})`);
    console.log(`Original password: ${user.password}`);
    console.log(`Hashed password: ${hashedPassword}`);
    console.log('---');
  }
  
  console.log('\n📋 Copy the following data to your Google Sheets Users tab:');
  console.log('Make sure you have these headers in row 1:');
  console.log('ID | username | email | password | fullName | role | status | createdAt | lastLogin | permissions | phone | department | notes');
  console.log('\nSample data rows:');
  
  for (const user of users) {
    const hashedPassword = await hashPassword(user.password);
    console.log(`${user.id} | ${user.username} | ${user.email} | ${hashedPassword} | ${user.fullName} | ${user.role} | ${user.status} | ${user.createdAt} | ${user.lastLogin} | ${user.permissions} | ${user.phone} | ${user.department} | ${user.notes}`);
  }
  
  console.log('\n✅ Users setup complete!');
  console.log('You can now test login with:');
  console.log('- Username: admin, Password: admin123');
  console.log('- Username: editor1, Password: editor123');
}

// Run the setup
generateUserSetup().catch(console.error);
