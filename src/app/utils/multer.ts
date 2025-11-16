import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Check if we're in a serverless environment (Vercel, AWS Lambda, etc.)
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || !fs.existsSync(path.join(process.cwd(), 'src'));

let storage: multer.StorageEngine;

if (isServerless) {
  // Use memory storage for serverless environments
  // Files will be stored in memory and need to be uploaded to cloud storage
  storage = multer.memoryStorage();
} else {
  // Use disk storage for local development
  const uploadDir = path.join(__dirname, '..', 'uploads');
  
  // Only create directory if it doesn't exist and we're not in serverless
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    // Use disk storage if directory creation succeeded
    storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, uploadDir);
      },
      filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}${ext}`;
        cb(null, filename);
      }
    });
  } catch (error) {
    // If directory creation fails, fall back to memory storage
    console.warn('Failed to create upload directory, using memory storage:', error);
    storage = multer.memoryStorage();
  }
}

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

// Export storage type for conditional handling
export const isMemoryStorage = isServerless;
