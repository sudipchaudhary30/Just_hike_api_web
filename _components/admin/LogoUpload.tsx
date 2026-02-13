'use client';

import { useState, useRef } from 'react';

interface LogoUploadProps {
  onLogoChange: (imageUrl: string) => void;
  currentLogo?: string;
}

export default function LogoUpload({ onLogoChange, currentLogo }: LogoUploadProps) {
  const [preview, setPreview] = useState<string>(currentLogo || '');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      setPreview(imageUrl);
      onLogoChange(imageUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div 
        onClick={() => fileInputRef.current?.click()}
        className="relative w-full h-48 border-2 border-dashed border-green-500/50 rounded-xl flex items-center justify-center cursor-pointer hover:border-green-400 hover:bg-green-500/5 transition-all group"
      >
        {preview ? (
          <div className="relative w-full h-full">
            <img src={preview} alt="Logo preview" className="w-full h-full object-cover rounded-lg" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold">Click to change logo</span>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <span className="text-lg block mb-2 font-bold text-slate-400">LOGO</span>
            <p className="text-slate-400 font-semibold">Click to upload logo</p>
            <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</p>
          </div>
        )}
      </div>
    </div>
  );
}
