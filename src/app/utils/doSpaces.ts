import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import config from '../config';

// Initialize S3 client only if configured
let s3Client: S3Client | null = null;

const initializeS3Client = () => {
  if (!s3Client && isDoSpacesConfigured()) {
    s3Client = new S3Client({
      endpoint: config.do_spaces.endpoint,
      region: config.do_spaces.region || 'nyc3',
      credentials: {
        accessKeyId: config.do_spaces.key || '',
        secretAccessKey: config.do_spaces.secret || '',
      },
      forcePathStyle: false, // Digital Ocean Spaces uses virtual-hosted-style URLs
    });
  }
  return s3Client;
};

/**
 * Check if Digital Ocean Spaces is configured
 */
export const isDoSpacesConfigured = (): boolean => {
  return !!(
    config.do_spaces.endpoint &&
    config.do_spaces.key &&
    config.do_spaces.secret &&
    config.do_spaces.bucket
  );
};

/**
 * Upload a file buffer to Digital Ocean Spaces
 * @param buffer - File buffer
 * @param folder - Folder path in Spaces (optional)
 * @param filename - Custom filename (optional, defaults to timestamp)
 * @returns Promise with the uploaded file URL
 */
export const uploadToDoSpaces = async (
  buffer: Buffer,
  folder: string = 'blog-images',
  filename?: string
): Promise<string> => {
  if (!isDoSpacesConfigured()) {
    throw new Error('Digital Ocean Spaces is not configured');
  }

  const client = initializeS3Client();
  if (!client) {
    throw new Error('Failed to initialize S3 client');
  }

  // Extract file extension from filename or default to jpg
  let fileExtension = 'jpg';
  if (filename) {
    const extMatch = filename.match(/\.([^.]+)$/);
    if (extMatch) {
      fileExtension = extMatch[1];
    }
  }

  // Generate unique filename
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 9);
  const fileName = filename || `${timestamp}-${randomStr}.${fileExtension}`;
  const key = folder ? `${folder}/${fileName}` : fileName;

  try {
    const command = new PutObjectCommand({
      Bucket: config.do_spaces.bucket,
      Key: key,
      Body: buffer,
      ACL: 'public-read', // Make the file publicly accessible
    });

    await client.send(command);

    // Construct the public URL
    // Digital Ocean Spaces URL format: https://{bucket}.{region}.digitaloceanspaces.com/{key}
    const endpoint = config.do_spaces.endpoint || '';
    let publicUrl: string;
    
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      // Endpoint is a full URL (e.g., https://nyc3.digitaloceanspaces.com)
      const endpointUrl = new URL(endpoint);
      // Extract region from hostname if possible, or use configured region
      const region = config.do_spaces.region || endpointUrl.hostname.split('.')[0] || 'nyc3';
      publicUrl = `https://${config.do_spaces.bucket}.${region}.digitaloceanspaces.com/${key}`;
    } else {
      // Endpoint is just the hostname (e.g., nyc3.digitaloceanspaces.com)
      const region = config.do_spaces.region || endpoint.split('.')[0] || 'nyc3';
      publicUrl = `https://${config.do_spaces.bucket}.${region}.digitaloceanspaces.com/${key}`;
    }

    return publicUrl;
  } catch (error) {
    console.error('Digital Ocean Spaces upload failed:', error);
    throw error;
  }
};

