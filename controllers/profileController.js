const { 
  profiles, 
  calculateMatchPercentage, 
  isConnected, 
  isRejected, 
  connectUsers, 
  rejectUser,
  userConnections 
} = require('../models/mockData');
//any user update requires non matched % 
// Get a single profile by ID
exports.getProfileById = async (req, res) => {
  try {
    const profile = profiles.find(p => p.id === req.params.id);
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get top matching profiles based on a reference profile ID
exports.getTopMatches = async (req, res) => {
  try {
    const { referenceProfileId } = req.params;
    const { limit = 10 } = req.query;
    
    // Validate limit parameter
    const matchLimit = parseInt(limit);
    if (isNaN(matchLimit) || matchLimit <= 0) {
      return res.status(400).json({ message: 'Invalid limit parameter' });
    }
    
    // Find the reference profile
    const referenceProfile = profiles.find(p => p.id === referenceProfileId);
    if (!referenceProfile) {
      return res.status(404).json({ message: 'Reference profile not found' });
    }
    
    // Get all other profiles
    let otherProfiles = profiles.filter(p => p.id !== referenceProfileId);

      // Get user connections data
      const userConnectionData = userConnections[referenceProfileId] || { connections: [], rejections: [] };
      
      // Filter out profiles that the user has already connected with or rejected
      otherProfiles = otherProfiles.filter(profile => {
        return !userConnectionData.connections.includes(profile.id) && 
               !userConnectionData.rejections.includes(profile.id);
      });
    
    
    // Calculate match percentage for each profile
    const profilesWithMatchScore = otherProfiles.map(profile => {
      const matchPercentage = calculateMatchPercentage(referenceProfile, profile);
      return {
        profile: {
          id: profile.id,
          name: profile.name,
          age: profile.age,
          pronouns: profile.pronouns,
          location: profile.location,
          bio: profile.bio || '',
          linkedinLink: profile.linkedinLink,
          profilePicture: profile.profilePicture,
          interests: profile.interests
        },
        matchPercentage,
        isConnected: isConnected(referenceProfileId, profile.id),
        isRejected: isRejected(referenceProfileId, profile.id)
      };
    });
    
    // Sort by match percentage in descending order
    profilesWithMatchScore.sort((a, b) => b.matchPercentage - a.matchPercentage);
    
    // Return top matches based on limit
    const topMatches = profilesWithMatchScore.slice(0, matchLimit);
    
    res.status(200).json(topMatches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Connect with a profile
exports.connectWithProfile = async (req, res) => {
  try {
    const { userId, targetId } = req.params;
    
    // Validate both users exist
    const user = profiles.find(p => p.id === userId);
    const targetUser = profiles.find(p => p.id === targetId);
    
    if (!user || !targetUser) {
      return res.status(404).json({ message: 'One or both users not found' });
    }
    
    // Connect the users
    const connected = connectUsers(userId, targetId);
    
    if (connected) {
      // Check if this is a mutual connection
      const isMutualConnection = isConnected(targetId, userId);
      
      res.status(200).json({ 
        message: `Successfully connected with ${targetUser.name}`,
        isMutualConnection
      });
    } else {
      res.status(200).json({ 
        message: `Already connected with ${targetUser.name}` 
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject a profile
exports.rejectProfile = async (req, res) => {
  try {
    const { userId, targetId } = req.params;
    
    // Validate both users exist
    const user = profiles.find(p => p.id === userId);
    const targetUser = profiles.find(p => p.id === targetId);
    
    if (!user || !targetUser) {
      return res.status(404).json({ message: 'One or both users not found' });
    }
    
    // Reject the user
    const rejected = rejectUser(userId, targetId);
    
    if (rejected) {
      res.status(200).json({ 
        message: `Successfully rejected ${targetUser.name}` 
      });
    } else {
      res.status(200).json({ 
        message: `Already rejected ${targetUser.name}` 
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get connection status between two users
exports.getConnectionStatus = async (req, res) => {
  try {
    const { userId, targetId } = req.params;
    
    // Validate both users exist
    const user = profiles.find(p => p.id === userId);
    const targetUser = profiles.find(p => p.id === targetId);
    
    if (!user || !targetUser) {
      return res.status(404).json({ message: 'One or both users not found' });
    }
    
    const status = {
      isConnected: isConnected(userId, targetId),
      isRejected: isRejected(userId, targetId),
      isMutualConnection: isConnected(userId, targetId) && isConnected(targetId, userId)
    };
    
    res.status(200).json(status);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 