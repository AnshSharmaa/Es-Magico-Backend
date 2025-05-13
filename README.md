# Dating App Profile API

A simple Express.js backend for a dating app profile system that focuses on matching profiles using mock data.

## Features

- Mock data for profile storage and retrieval
- Express.js API for retrieving matches
- Match percentage algorithm based on interests and location
- User interaction features (connect/reject)
- Filtered recommendations excluding already connected/rejected profiles
- Structured API response format

## Prerequisites

- Node.js (v14 or higher)

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```

## Start the Application

Development mode:
```
npm run dev
```

Production mode:
```
npm start
```

## API Endpoints

### Profiles

| Method | Endpoint                             | Description                                     |
|--------|--------------------------------------|-------------------------------------------------|
| GET    | /api/profiles/:id                    | Get a profile by ID                             |
| GET    | /api/profiles/matches/:referenceProfileId | Get top matching profiles for a given profile |
| POST   | /api/profiles/connect/:userId/:targetId | Connect with a profile                        |
| POST   | /api/profiles/reject/:userId/:targetId | Reject a profile                               |
| GET    | /api/profiles/status/:userId/:targetId | Get connection status between two users        |

## Profile Data Structure

```json
{
  "id": "1",
  "name": "John Doe",
  "age": 28,
  "pronouns": "he/him",
  "bio": "I love hiking and photography",
  "location": "New York, NY",
  "linkedinLink": "https://linkedin.com/in/johndoe",
  "profilePicture": "/uploads/profile1.jpg",
  "videoPitch": "/uploads/video1.mp4",
  "faqs": [
    {
      "question": "What are you looking for?",
      "answer": "Someone with similar interests"
    },
    {
      "question": "Favorite movie?",
      "answer": "The Shawshank Redemption"
    }
  ],
  "interests": ["hiking", "photography", "cooking", "movies"]
}
```

## Getting Top Matches

To get top matches for a profile, send a GET request to:
```
/api/profiles/matches/:referenceProfileId?limit=10&includeInteracted=false
```

Parameters:
- `referenceProfileId`: The ID of the profile to find matches for
- `limit` (optional): Maximum number of matches to return (default: 10)
- `includeInteracted` (optional): Whether to include profiles that the user has already connected with or rejected (default: false)

By default, the API filters out profiles that the user has already connected with or rejected. Set `includeInteracted=true` if you want to include these profiles.

The response will include an array of profiles with their match percentages and connection status:

```json
[
  {
    "profile": {
      "id": "2",
      "name": "Jane Smith",
      "age": 26,
      "pronouns": "she/her",
      "location": "San Francisco, CA",
      "bio": "I enjoy hiking and photography",
      "linkedinLink": "https://linkedin.com/in/janesmith",
      "profilePicture": "/uploads/profile2.jpg",
      "interests": ["hiking", "photography", "travel"]
    },
    "matchPercentage": 75,
    "isConnected": false,
    "isRejected": false
  }
]
```

## User Interaction

### Connect with a Profile

To connect with a profile, send a POST request to:
```
/api/profiles/connect/:userId/:targetId
```

Parameters:
- `userId`: The ID of the user making the connection
- `targetId`: The ID of the profile to connect with

Response:
```json
{
  "message": "Successfully connected with Jane Smith",
  "isMutualConnection": false
}
```

### Reject a Profile

To reject a profile, send a POST request to:
```
/api/profiles/reject/:userId/:targetId
```

Parameters:
- `userId`: The ID of the user rejecting the profile
- `targetId`: The ID of the profile to reject

Response:
```json
{
  "message": "Successfully rejected Jane Smith"
}
```

### Check Connection Status

To check the connection status between two users, send a GET request to:
```
/api/profiles/status/:userId/:targetId
```

Parameters:
- `userId`: The ID of the first user
- `targetId`: The ID of the second user

Response:
```json
{
  "isConnected": true,
  "isRejected": false,
  "isMutualConnection": true
}
```

## Mock Data

The application uses mock data instead of a real database:
- 5 sample profiles with different characteristics
- Profiles include name, age, pronouns, location, linkedinLink, and interests
- Match calculation is based on common interests (80% weight) and location (20% weight)
- Connections and rejections are tracked in-memory

## Match Algorithm

The match percentage is calculated based on:
- Common interests (up to 80%)
- Location proximity (up to 20%)

## Security Considerations

- Implement proper authentication before deployment
- Validate user input to prevent security vulnerabilities
- Consider rate limiting to protect from abuse

## License

MIT 