import multer from 'multer';
import path from 'path';
import { NextRequest } from 'next/server';

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine folder based on field name
    let folder = 'users';
    if (file.fieldname === 'trekImage' || req.body?.type === 'trek') folder = 'treks';
    else if (file.fieldname === 'guideImage' || req.body?.type === 'guide') folder = 'guides';
    else if (file.fieldname === 'blogImage' || req.body?.type === 'blog') folder = 'blogs';
    cb(null, path.join(process.cwd(), 'public', 'uploads', folder));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    let prefix = 'user';
    if (file.fieldname === 'trekImage' || req.body?.type === 'trek') prefix = 'trek';
    else if (file.fieldname === 'guideImage' || req.body?.type === 'guide') prefix = 'guide';
    else if (file.fieldname === 'blogImage' || req.body?.type === 'blog') prefix = 'blog';
    cb(null, `${prefix}-${uniqueSuffix}${path.extname(file.originalname)}`);
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
export async function saveFile(file: File, p0: string): Promise<string> {
  if (!file) {
    throw new Error('No file provided');
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Determine folder and prefix based on file name or type
  let folder = 'users';
  let prefix = 'user';
  if (file.name.startsWith('trek-') || file.type === 'trek') {
    folder = 'treks';
    prefix = 'trek';
  } else if (file.name.startsWith('guide-') || file.type === 'guide') {
    folder = 'guides';
    prefix = 'guide';
  } else if (file.name.startsWith('blog-') || file.type === 'blog') {
    folder = 'blogs';
    prefix = 'blog';
  }
  // Create unique filename
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const ext = path.extname(file.name);
  const filename = `${prefix}-${uniqueSuffix}${ext}`;
  // Save to correct directory
  const fs = require('fs').promises;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
  await fs.mkdir(uploadDir, { recursive: true });
  const filepath = path.join(uploadDir, filename);
  await fs.writeFile(filepath, buffer);
  // Return the public URL
  return `/uploads/${folder}/${filename}`;
}
