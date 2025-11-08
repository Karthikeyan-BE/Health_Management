import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    // Regex to validate email format
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
    // Note: You must hash this password before saving!
  },
  role: {
    type: String,
    required: true,
    enum: {
      values: ['user', 'doctor', 'admin'],
      message: '{VALUE} is not a supported role'
    },
    default: 'user'
  },
  
  // --- Doctor-Specific Fields ---
  specialization: {
    type: String,
    trim: true,
    // This field is only logically required if role is 'doctor'.
    // You'll enforce this in your 'doctor registration' logic.
  },
  isVerified: {
    type: Boolean,
    default: false
    // An admin must set this to 'true' for a doctor to be active.
  }
}, {
  // Adds 'createdAt' and 'updatedAt' fields automatically
  timestamps: true 
});

// Reminder: Add a 'pre-save' hook here to hash the password
// userSchema.pre('save', async function(next) { ... });

export default  mongoose.model('User', userSchema);