import multer from 'multer';
import path from 'path';
import { NextRequest } from 'next/server';

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'public', 'uploads', 'users'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'user-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to accept only images
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

// Create multer instance
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

/**
 * Helper function to handle file upload in Next.js API routes
 * Since Next.js doesn't work directly with multer, we need to parse the form data manually
 */
export async function parseFormData(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;
    const fields: Record<string, any> = {};

    // Extract all form fields
    formData.forEach((value, key) => {
      if (key !== 'image') {
        fields[key] = value;
      }
    });

    return { file, fields };
  } catch (error) {
    throw new Error('Failed to parse form data');
  }
}

/**
 * Save uploaded file to disk
 */
export async function saveFile(file: File): Promise<string> {
  if (!file) {
    throw new Error('No file provided');
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create unique filename
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const ext = path.extname(file.name);
  const filename = 'user-' + uniqueSuffix + ext;
  
  // Save to public/uploads/users directory
  const fs = require('fs').promises;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'users');
  
  // Create directory if it doesn't exist
  await fs.mkdir(uploadDir, { recursive: true });
  
  const filepath = path.join(uploadDir, filename);
  await fs.writeFile(filepath, buffer);

  // Return the public URL
  return `/uploads/users/${filename}`;
}
