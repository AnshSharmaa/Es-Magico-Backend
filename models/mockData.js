// Mock data for profiles
const profiles = [
  {
    id: "1",
    name: "John Doe",
    age: 28,
    pronouns: "he/him",
    location: "New York, NY",
    linkedinLink: "https://linkedin.com/in/johndoe",
    profilePicture: "/uploads/profile1.jpg",
    videoPitch: "/uploads/video1.mp4",
    faqs: [
      { question: "What are you looking for?", answer: "Someone with similar interests" },
      { question: "Favorite movie?", answer: "The Shawshank Redemption" },
      { question: "Dream vacation?", answer: "Hiking in New Zealand" }
    ],
    interests: ["hiking", "photography", "cooking", "movies"],
    createdAt: "2023-06-15T10:30:00Z",
    updatedAt: "2023-06-15T10:30:00Z"
  },
  {
    id: "2",
    name: "Jane Smith",
    age: 26,
    pronouns: "she/her",
    location: "San Francisco, CA",
    linkedinLink: "https://linkedin.com/in/janesmith",
    profilePicture: "/uploads/profile2.jpg",
    videoPitch: "/uploads/video2.mp4",
    faqs: [
      { question: "What do you do for fun?", answer: "I love dancing and rock climbing" },
      { question: "Favorite book?", answer: "Pride and Prejudice" },
      { question: "Morning person or night owl?", answer: "Definitely a night owl" }
    ],
    interests: ["dancing", "rock climbing", "reading", "travel"],
    createdAt: "2023-06-17T14:20:00Z",
    updatedAt: "2023-06-17T14:20:00Z"
  },
  {
    id: "3",
    name: "Alex Johnson",
    age: 30,
    pronouns: "they/them",
    location: "Austin, TX",
    linkedinLink: "https://linkedin.com/in/alexjohnson",
    profilePicture: "/uploads/profile3.jpg",
    videoPitch: "/uploads/video3.mp4",
    faqs: [
      { question: "Favorite cuisine?", answer: "Thai food, especially pad thai" },
      { question: "What's your ideal date?", answer: "A hike followed by dinner" },
      { question: "Pets?", answer: "I have a golden retriever named Max" }
    ],
    interests: ["music", "hiking", "cooking", "dogs"],
    createdAt: "2023-06-20T09:15:00Z",
    updatedAt: "2023-06-20T09:15:00Z"
  },
  {
    id: "4",
    name: "Sam Wilson",
    age: 32,
    pronouns: "he/him",
    location: "Chicago, IL",
    linkedinLink: "https://linkedin.com/in/samwilson",
    profilePicture: "/uploads/profile4.jpg",
    videoPitch: "/uploads/video4.mp4",
    faqs: [
      { question: "Favorite way to spend a weekend?", answer: "Exploring new restaurants" },
      { question: "What are you passionate about?", answer: "Social justice and equality" },
      { question: "Coffee or tea?", answer: "Coffee, strong and black" }
    ],
    interests: ["food", "social justice", "running", "travel"],
    createdAt: "2023-07-01T11:45:00Z",
    updatedAt: "2023-07-01T11:45:00Z"
  },
  {
    id: "5",
    name: "Emily Chen",
    age: 27,
    pronouns: "she/her",
    location: "Seattle, WA",
    linkedinLink: "https://linkedin.com/in/emilychen",
    profilePicture: "/uploads/profile5.jpg",
    videoPitch: "/uploads/video5.mp4",
    faqs: [
      { question: "What do you do for work?", answer: "I'm a software engineer" },
      { question: "Favorite season?", answer: "Fall - perfect sweater weather" },
      { question: "Beach or mountains?", answer: "Mountains for sure" }
    ],
    interests: ["coding", "hiking", "board games", "photography"],
    createdAt: "2023-07-05T16:30:00Z",
    updatedAt: "2023-07-05T16:30:00Z"
  }
];

// Mock data structure to track connections and rejections between users
// Format: { userId: { connections: [targetIds], rejections: [targetIds] } }

const userConnections = {
  "1": { connections: ["3"], rejections: ["4"] },
  "2": { connections: ["5"], rejections: [] },
  "3": { connections: ["1"], rejections: ["2"] },
  "4": { connections: [], rejections: ["1"] },
  "5": { connections: ["2"], rejections: [] }
};
//1 match to run daily is heavy compute, when ever their profile, run 
// Helper function to calculate match percentage between two profiles
const calculateMatchPercentage = (profile1, profile2) => {
  let matchScore = 0;
  
  // Compare interests if both profiles have interests
  if (profile1.interests && profile1.interests.length > 0 && 
      profile2.interests && profile2.interests.length > 0) {
    
    // Find common interests
    const commonInterests = profile1.interests.filter(interest => 
      profile2.interests.includes(interest)
    );
    
    // Calculate interest match percentage (80% weight)
    const interestMatchScore = (commonInterests.length / 
      Math.max(profile1.interests.length, profile2.interests.length)) * 80;
    
    matchScore += interestMatchScore;
  }
  
  // Location match (20% weight)
  if (profile1.location === profile2.location) {
    matchScore += 20;
  }
  
  // Return rounded percentage
  return Math.min(Math.round(matchScore), 100);
};

// Helper function to check if two users are connected
const isConnected = (userId, targetId) => {
  return userConnections[userId]?.connections.includes(targetId);
};

// Helper function to check if a user has rejected another user
const isRejected = (userId, targetId) => {
  return userConnections[userId]?.rejections.includes(targetId);
};

// Helper function to connect two users
const connectUsers = (userId, targetId) => {
  // Initialize connections array if it doesn't exist
  if (!userConnections[userId]) {
    userConnections[userId] = { connections: [], rejections: [] };
  }
  
  // Check if users are already connected
  if (!isConnected(userId, targetId)) {
    // Remove from rejections if previously rejected
    userConnections[userId].rejections = userConnections[userId].rejections.filter(id => id !== targetId);
    // Add to connections
    userConnections[userId].connections.push(targetId);
    return true;
  }
  
  return false;
};

// Helper function to reject a user
const rejectUser = (userId, targetId) => {
  // Initialize connections array if it doesn't exist
  if (!userConnections[userId]) {
    userConnections[userId] = { connections: [], rejections: [] };
  }
  
  // Check if user is already rejected
  if (!isRejected(userId, targetId)) {
    // Remove from connections if previously connected
    userConnections[userId].connections = userConnections[userId].connections.filter(id => id !== targetId);
    // Add to rejections
    userConnections[userId].rejections.push(targetId);
    return true;
  }
  
  return false;
};

// Export the mock data and helpers
module.exports = {
  profiles,
  userConnections,
  calculateMatchPercentage,
  isConnected,
  isRejected,
  connectUsers,
  rejectUser
}; 