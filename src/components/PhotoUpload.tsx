import { useState, useRef } from 'react';
import { Upload, Trash2, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { savePhoto, fileToDataUrl, type PhotoRecord } from '../db/photoDatabase';

interface PhotoUploadProps {
  slotId: string;
  caption: string;
  currentPhoto: PhotoRecord | null;
  onPhotoUploaded: (photo: PhotoRecord) => void;
  onPhotoDeleted: () => void;
}

export function PhotoUpload({ 
  slotId, 
  caption, 
  currentPhoto, 
  onPhotoUploaded, 
  onPhotoDeleted 
}: PhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);
    
    try {
      const dataUrl = await fileToDataUrl(file);
      setPreview(dataUrl);
      
      const photo: PhotoRecord = {
        id: slotId,
        name: file.name,
        dataUrl: dataUrl,
        caption: caption,
        uploadedAt: new Date()
      };
      
      await savePhoto(photo);
      onPhotoUploaded(photo);
      setPreview(null);
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to remove this photo?')) {
      onPhotoDeleted();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative group"
    >
      <div className="relative overflow-hidden rounded-2xl shadow-lg bg-gray-100 aspect-[4/3]">
        {/* Current Photo or Preview */}
        {(currentPhoto || preview) ? (
          <>
            <img
              src={preview || currentPhoto?.dataUrl}
              alt={caption}
              className="w-full h-full object-cover"
            />
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex gap-2">
                <button
                  onClick={triggerFileInput}
                  className="bg-white text-rose-600 p-2 rounded-full hover:bg-rose-50 transition-colors"
                  title="Change Photo"
                >
                  <Upload className="w-5 h-5" />
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-white text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                  title="Delete Photo"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Success Indicator */}
            {!preview && currentPhoto && (
              <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                <Check className="w-4 h-4" />
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div 
            onClick={triggerFileInput}
            className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
          >
            <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mb-3">
              <Upload className="w-8 h-8 text-rose-500" />
            </div>
            <p className="text-gray-600 font-medium">Click to upload</p>
            <p className="text-gray-400 text-sm">{caption}</p>
          </div>
        )}

        {/* Uploading Indicator */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-white rounded-lg p-4 flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-800">Uploading...</span>
            </div>
          </div>
        )}
      </div>

      {/* Caption */}
      <p className="mt-2 text-center text-rose-800 font-medium">{caption}</p>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </motion.div>
  );
}

interface PhotoGalleryManagerProps {
  photoSlots: { id: string; caption: string }[];
  photos: Record<string, PhotoRecord>;
  onPhotosChange: (photos: Record<string, PhotoRecord>) => void;
}

export function PhotoGalleryManager({ 
  photoSlots, 
  photos, 
  onPhotosChange 
}: PhotoGalleryManagerProps) {
  const handlePhotoUploaded = (photo: PhotoRecord) => {
    onPhotosChange({ ...photos, [photo.id]: photo });
  };

  const handlePhotoDeleted = async (slotId: string) => {
    const { deletePhoto } = await import('../db/photoDatabase');
    await deletePhoto(slotId);
    const newPhotos = { ...photos };
    delete newPhotos[slotId];
    onPhotosChange(newPhotos);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {photoSlots.map((slot, index) => (
        <motion.div
          key={slot.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <PhotoUpload
            slotId={slot.id}
            caption={slot.caption}
            currentPhoto={photos[slot.id] || null}
            onPhotoUploaded={handlePhotoUploaded}
            onPhotoDeleted={() => handlePhotoDeleted(slot.id)}
          />
        </motion.div>
      ))}
    </div>
  );
}
