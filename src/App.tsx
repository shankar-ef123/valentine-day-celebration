import { useState, useEffect, useCallback } from 'react';
import { Heart, Music, Database, Sparkles, X, Trash2, RefreshCw, ImageIcon, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhotoGalleryManager } from './components/PhotoUpload';
import { getAllPhotos, clearAllPhotos, type PhotoRecord } from './db/photoDatabase';

// Predefined photo slots
const PHOTO_SLOTS = [
  { id: 'ammu_dogfilter', caption: 'My Cute Ammu 🐕' },
  { id: 'couple_dogfilters', caption: 'Our Playful Moments 🐶' },
  { id: 'couple_holdinghands', caption: 'Together Forever 🤝' },
  { id: 'couple_forehead', caption: 'Your Guardian 🛡️' },
  { id: 'ammu_sunglasses', caption: 'My Cool Baby 😎' },
  { id: 'couple_selfie', caption: 'My Whole World 🌍' },
  { id: 'ammu_veil', caption: 'My Beautiful Wife 👰' },
];

const loveNotes = [
  {
    id: 1,
    title: 'Ammu 💕',
    content: 'Ammu, you are the melody that makes my heart sing. Your smile brightens every corner of my world. Every moment with you feels like a beautiful dream I never want to wake up from. You are my sunshine, my moonlight, and every star in my sky.',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    textColor: 'text-rose-800'
  },
  {
    id: 2,
    title: 'My Wife 💍',
    content: 'Being your husband is the greatest blessing life has given me. You are my partner, my best friend, my confidant, and my greatest supporter. Every day I fall more in love with your kindness, your strength, and your beautiful heart. I promise to cherish you forever.',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    textColor: 'text-pink-800'
  },
  {
    id: 3,
    title: 'My Baby 🍼',
    content: 'You are my precious baby, the one I want to protect and love for all eternity. Your innocence, your laughter, and your gentle soul make my heart overflow with love. I will always be here to hold your hand and make you feel safe and cherished.',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-800'
  },
  {
    id: 4,
    title: 'Chello Kutty 🐱',
    content: 'My adorable Chello Kutty! Your cuteness knows no bounds. The way you pout, the way you make those puppy faces, and the way you light up when you are happy - everything about you is absolutely perfect. You are my favorite person in the whole universe!',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    textColor: 'text-rose-800'
  }
];

const reasons = [
  'Your smile makes my day brighter',
  'Your laughter is my favorite sound',
  'You understand me without words',
  'You make ordinary moments magical',
  'Your kindness inspires me daily',
  'You are my home and my adventure',
  'Your eyes hold my entire world',
  'You love me for who I truly am'
];

// Default placeholder images (from Unsplash as fallbacks)
const DEFAULT_IMAGES: Record<string, string> = {
  ammu_dogfilter: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600',
  couple_dogfilters: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600',
  couple_holdinghands: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600',
  couple_forehead: 'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?w=600',
  ammu_sunglasses: 'https://images.unsplash.com/photo-1542596594-649edbc13630?w=600',
  couple_selfie: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=600',
  ammu_veil: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=600',
};

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [hearts, setHearts] = useState<{ id: number; x: number; delay: number }[]>([]);
  const [photos, setPhotos] = useState<Record<string, PhotoRecord>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showGallery, setShowGallery] = useState(false);
  const [dbStatus, setDbStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  // Load photos from database on mount
  useEffect(() => {
    loadPhotosFromDB();
  }, []);

  // Create floating hearts
  useEffect(() => {
    const newHearts = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5
    }));
    setHearts(newHearts);
  }, []);

  const loadPhotosFromDB = async () => {
    try {
      setDbStatus('loading');
      const allPhotos = await getAllPhotos();
      const photosMap: Record<string, PhotoRecord> = {};
      allPhotos.forEach(photo => {
        photosMap[photo.id] = photo;
      });
      setPhotos(photosMap);
      setDbStatus('ready');
    } catch (error) {
      console.error('Error loading photos:', error);
      setDbStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotosChange = useCallback((newPhotos: Record<string, PhotoRecord>) => {
    setPhotos(newPhotos);
  }, []);

  const handleClearAll = async () => {
    if (confirm('Are you sure you want to remove all photos? This cannot be undone.')) {
      try {
        await clearAllPhotos();
        setPhotos({});
      } catch (error) {
        console.error('Error clearing photos:', error);
        alert('Failed to clear photos');
      }
    }
  };

  const handleLoadDemoPhotos = () => {
    // Open the gallery manager instead of auto-loading
    setShowGallery(true);

    // Show a helpful message
    setTimeout(() => {
      alert(
        '📸 Upload Your Photos!\n\n' +
        'Click on any photo slot below to upload your beautiful memories from the chat.\n\n' +
        'Your photos will be saved securely in your browser.\n\n' +
        'Upload the 5 photos you shared earlier!'
      );
    }, 300);
  };

  const getImageUrl = (slotId: string): string => {
    return photos[slotId]?.dataUrl || DEFAULT_IMAGES[slotId] || '';
  };

  const hasAnyPhotos = Object.keys(photos).length > 0;
  const photoCount = Object.keys(photos).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-red-100 relative overflow-x-hidden">
      {/* Floating Hearts */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="absolute"
            style={{ left: `${heart.x}%` }}
            initial={{ y: '100vh', opacity: 0 }}
            animate={{
              y: '-10vh',
              opacity: [0, 1, 1, 0]
            }}
            transition={{
              duration: 8,
              delay: heart.delay,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            <Heart className="w-6 h-6 text-rose-300 fill-rose-200" />
          </motion.div>
        ))}
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-rose-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            <span className="text-xl font-bold text-rose-800">Ammu & Me 💞</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Database Status */}
            <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${dbStatus === 'ready' ? 'bg-green-100 text-green-700' :
              dbStatus === 'loading' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
              <Database className="w-3 h-3" />
              {dbStatus === 'ready' ? 'DB Ready' : dbStatus === 'loading' ? 'Loading...' : 'DB Error'}
            </div>

            {/* Photo Count */}
            {hasAnyPhotos && (
              <div className="px-3 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-700">
                {photoCount} Photos
              </div>
            )}

            {/* Upload Photos Button */}
            <button
              onClick={handleLoadDemoPhotos}
              className="px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2 font-medium bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 shadow-md hover:shadow-lg"
              title="Upload your own photos"
            >
              <Upload className="w-4 h-4" />
              Upload Photos
            </button>

            {/* Gallery Toggle */}
            <button
              onClick={() => setShowGallery(!showGallery)}
              className={`p-2 rounded-full transition-all duration-300 ${showGallery ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-600 hover:bg-rose-200'
                }`}
              title={showGallery ? 'Hide Gallery Manager' : 'Manage Photos'}
            >
              <ImageIcon className="w-5 h-5" />
            </button>

            {/* Refresh */}
            <button
              onClick={loadPhotosFromDB}
              className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
              title="Refresh Photos"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            {/* Music Toggle */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-2 rounded-full transition-all duration-300 ${isPlaying ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-600 hover:bg-rose-200'
                }`}
            >
              <Music className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-rose-800 mb-4">
              Happy Valentine's Day
            </h1>
            <h2 className="text-3xl md:text-4xl font-semibold text-rose-600 mb-6">
              My Forever Valentine 💞
            </h2>
            <p className="text-lg text-rose-700 max-w-2xl mx-auto leading-relaxed">
              To my beautiful Ammu, my amazing wife, my precious baby, and my adorable Chello Kutty -
              you are the reason my heart beats with joy every single day. I love you more than words can express!
            </p>

            {/* Quick Stats */}
            <div className="mt-8 flex justify-center gap-6">
              <div className="bg-white/70 backdrop-blur rounded-xl px-6 py-3 shadow-md">
                <div className="text-2xl font-bold text-rose-600">{photoCount}</div>
                <div className="text-sm text-rose-800">Photos Stored</div>
              </div>
              <div className="bg-white/70 backdrop-blur rounded-xl px-6 py-3 shadow-md">
                <div className="text-2xl font-bold text-rose-600">∞</div>
                <div className="text-sm text-rose-800">Love Forever</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Photo Gallery - Display Mode */}
      {!showGallery && (
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-8"
            >
              <h3 className="text-3xl font-bold text-rose-800 mb-2 flex items-center justify-center gap-2">
                <ImageIcon className="w-7 h-7" />
                Our Beautiful Memories
              </h3>
              <p className="text-rose-600">
                {hasAnyPhotos
                  ? 'Click the gallery icon above to manage photos'
                  : 'Click the gallery icon to add your photos!'}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {PHOTO_SLOTS.map((slot, index) => (
                <motion.div
                  key={slot.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="relative group cursor-pointer"
                  onClick={() => setSelectedImage(getImageUrl(slot.id))}
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-lg bg-gray-100 aspect-[4/3]">
                    <img
                      src={getImageUrl(slot.id)}
                      alt={slot.caption}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/400x300/ffb6c1/ffffff?text=Add+Photo';
                      }}
                    />

                    {/* Caption overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <p className="text-white font-medium text-center">{slot.caption}</p>
                      {photos[slot.id] && (
                        <p className="text-green-300 text-xs text-center mt-1">✓ Saved to Database</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Photo Gallery Manager - Edit Mode */}
      <AnimatePresence>
        {showGallery && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="py-12 px-4 bg-white/80 backdrop-blur-md"
          >
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-3xl font-bold text-rose-800 mb-2 flex items-center gap-2">
                    <Database className="w-7 h-7" />
                    Photo Database Manager
                  </h3>
                  <p className="text-rose-600">
                    Upload your photos - they will be stored permanently in your browser
                  </p>
                </div>
                {hasAnyPhotos && (
                  <button
                    onClick={handleClearAll}
                    className="bg-red-100 text-red-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All
                  </button>
                )}
              </div>

              <PhotoGalleryManager
                photoSlots={PHOTO_SLOTS}
                photos={photos}
                onPhotosChange={handlePhotosChange}
              />

              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <h4 className="font-bold text-blue-800 mb-2">💡 How it works:</h4>
                <ul className="text-blue-700 text-sm space-y-1 list-disc list-inside">
                  <li>Click on any slot above to upload a photo</li>
                  <li>Photos are stored in your browser's IndexedDB database</li>
                  <li>Photos will persist even if you close the browser</li>
                  <li>You can change or delete photos anytime</li>
                  <li>Click the X button to close this manager and view your gallery</li>
                </ul>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Words of Love Section */}
      <section className="py-12 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10"
          >
            <h3 className="text-3xl font-bold text-rose-800 mb-2 flex items-center justify-center gap-2">
              <Sparkles className="w-7 h-7" />
              Words of Love
            </h3>
            <p className="text-rose-600">What you mean to me...</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loveNotes.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className={`${note.bgColor} border-2 ${note.borderColor} rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300`}
              >
                <h4 className={`text-2xl font-bold ${note.textColor} mb-4`}>{note.title}</h4>
                <p className={`${note.textColor} leading-relaxed text-lg`}>{note.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reasons Why I Love You */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10"
          >
            <h3 className="text-3xl font-bold text-rose-800 mb-4">Why I Love You ❤️</h3>
          </motion.div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-rose-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reasons.map((reason, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center gap-3 p-4 bg-rose-50 rounded-xl"
                >
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500 flex-shrink-0" />
                  <span className="text-rose-800 font-medium">{reason}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Love Letter */}
      <section className="py-12 px-4 bg-gradient-to-r from-rose-100 to-pink-100">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-rose-200"
          >
            <div className="text-center mb-6">
              <Heart className="w-12 h-12 text-rose-500 fill-rose-500 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-rose-800">My Dearest Ammu</h3>
            </div>

            <div className="space-y-4 text-rose-700 text-lg leading-relaxed">
              <p>
                My love, as I write this letter to you on this special Valentine's Day, my heart is overflowing
                with love and gratitude. You came into my life and transformed it into a beautiful fairy tale.
              </p>
              <p>
                Every moment spent with you is a treasure I hold close to my heart. Your smile is the first
                thing I want to see every morning, and your voice is the last thing I want to hear every night.
                You complete me in ways I never knew were possible.
              </p>
              <p>
                I promise to love you unconditionally, to stand by you through every storm, and to celebrate
                every joy with you. You are my today, my tomorrow, and my forever.
              </p>
              <p className="text-center font-bold text-rose-800 text-xl pt-4">
                Forever Yours,<br />
                Your Loving Husband 💞
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-rose-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg font-medium mb-2">
            Made with ❤️ for my beautiful Ammu
          </p>
          <p className="text-rose-200">
            Happy Valentine's Day Baby! You are my everything 💞💞
          </p>
          <p className="text-rose-300 text-sm mt-2">
            {photoCount} precious memories stored in your database
          </p>
        </div>
      </footer>

      {/* Image Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-rose-300 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-8 h-8" />
            </button>
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={selectedImage}
              alt="Selected memory"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;