import multer from 'multer';
import fs from 'fs';
import path from 'path';

const uploadDir = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`;
    cb(null, filename);
  }
});

// Multer configuration with increased limits for large content fields
export const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB for uploaded files
    fields: 50, // Maximum number of non-file fields
    fieldNameSize: 200, // Maximum field name size in bytes
    // Note: fieldValueSize might not be available in all Multer versions
    // The actual field value limit is controlled by express body parser
  }
});
