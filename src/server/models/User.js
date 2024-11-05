const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  USER: 'user'
};

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: Object.values(ROLES),
    default: ROLES.USER
  },
  profileImage: {
    type: String,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  socialId: {
    type: String,
    unique: true,
    sparse: true
  },
  socialProvider: {
    type: String,
    enum: ['google', 'facebook', null],
    default: null
  },
  permissions: [{
    type: String,
    enum: [
      'create_post',
      'edit_post',
      'delete_post',
      'upload_media',
      'manage_users',
      'view_stats'
    ]
  }]
});

// Add role-based helper methods
userSchema.methods.hasRole = function(role) {
  return this.role === role;
};

userSchema.methods.hasPermission = function(permission) {
  return this.permissions.includes(permission);
};

userSchema.methods.isAdmin = function() {
  return this.role === ROLES.ADMIN;
};

// Static method to get role permissions
userSchema.statics.getRolePermissions = function(role) {
  const permissions = {
    [ROLES.ADMIN]: [
      'create_post',
      'edit_post',
      'delete_post',
      'upload_media',
      'manage_users',
      'view_stats'
    ],
    [ROLES.EDITOR]: [
      'create_post',
      'edit_post',
      'upload_media'
    ],
    [ROLES.USER]: []
  };
  return permissions[role] || [];
};

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  this.updatedAt = new Date();
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

module.exports = mongoose.model('User', userSchema);
module.exports.ROLES = ROLES; 