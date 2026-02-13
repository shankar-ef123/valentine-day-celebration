// Photo Database System using IndexedDB
// This stores your photos permanently in the browser

const DB_NAME = 'ValentinePhotosDB';
const DB_VERSION = 1;
const STORE_NAME = 'photos';

export interface PhotoRecord {
  id: string;
  name: string;
  dataUrl: string;
  caption: string;
  uploadedAt: Date;
}

// Initialize the database
export const initDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

// Save a photo to the database
export const savePhoto = async (photo: PhotoRecord): Promise<void> => {
  const db = await initDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(photo);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// Get a photo by ID
export const getPhoto = async (id: string): Promise<PhotoRecord | null> => {
  const db = await initDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
};

// Get all photos
export const getAllPhotos = async (): Promise<PhotoRecord[]> => {
  const db = await initDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// Delete a photo
export const deletePhoto = async (id: string): Promise<void> => {
  const db = await initDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// Clear all photos
export const clearAllPhotos = async (): Promise<void> => {
  const db = await initDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// Convert File to Data URL
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Add photo from URL (for programmatic import)
export const addPhotoFromUrl = async (id: string, imageUrl: string, caption: string): Promise<void> => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    const photo: PhotoRecord = {
      id,
      name: caption,
      dataUrl,
      caption,
      uploadedAt: new Date()
    };

    await savePhoto(photo);
  } catch (error) {
    console.error(`Failed to add photo from URL ${imageUrl}:`, error);
    throw error;
  }
};

