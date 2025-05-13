const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    required: true,
    trim: true
  }
});

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 18
  },
  pronouns: {
    type: String,
    required: true,
    trim: true
  },

  bio: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  linkedinLink: {
    type: String,
    trim: true
  },
  profilePicture: {
    type: String,  // Path to the profile picture
    required: true
  },
  videoPitch: {
    type: String,  // Path to the video pitch
    required: true
  },
  faqs: [faqSchema],
  interests: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
profileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate match percentage with another profile
profileSchema.methods.calculateMatchPercentage = function(otherProfile) {
  // Start with a base score
  let matchScore = 0;
  
  // Compare interests if both profiles have interests
  if (this.interests && this.interests.length > 0 && 
      otherProfile.interests && otherProfile.interests.length > 0) {
    
    // Find common interests
    const commonInterests = this.interests.filter(interest => 
      otherProfile.interests.includes(interest)
    );
    
    // Calculate interest match percentage (80% weight)
    const interestMatchScore = (commonInterests.length / 
      Math.max(this.interests.length, otherProfile.interests.length)) * 80;
    
    matchScore += interestMatchScore;
  }
  
  // Location match (20% weight)
  if (this.location === otherProfile.location) {
    matchScore += 20;
  }
  
  // Normalize score to be between 0-100
  return Math.min(Math.round(matchScore), 100);
};

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile; 