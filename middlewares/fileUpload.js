const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExt = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExt);
  }
});

// File filter to allow only images and videos
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'profilePicture') {
    // Accept only image files for profile pictures
    if (file.mimetype.startsWith('image/')) {
      return cb(null, true);
    }
    return cb(new Error('Only image files are allowed for profile pictures!'), false);
  }
  
  if (file.fieldname === 'videoPitch') {
    // Accept only video files for video pitches
    if (file.mimetype.startsWith('video/')) {
      return cb(null, true);
    }
    return cb(new Error('Only video files are allowed for video pitches!'), false);
  }
  
  cb(new Error('Unexpected field name'), false);
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
  }
});

module.exports = upload; 