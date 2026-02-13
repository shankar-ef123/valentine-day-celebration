import { getAllPhotos } from '../db/photoDatabase';

/**
 * Check if user has uploaded their own photos
 * This replaces the automatic demo photo loader
 * Users should upload their own photos using the gallery manager
 */

export async function checkUserPhotos() {
    const photos = await getAllPhotos();
    return {
        count: photos.length,
        hasPhotos: photos.length > 0,
        photos: photos
    };
}

export async function loadDemoPhotos() {
    // Show a message to the user
    alert(
        '📸 Please Upload Your Own Photos!\n\n' +
        'Click the Gallery Icon (📷) in the navigation bar to open the Photo Manager.\n\n' +
        'Then click on each photo slot to upload your beautiful memories!\n\n' +
        'Your photos will be saved securely in your browser.'
    );

    console.log('Please use the gallery manager to upload your own photos.');

    // Return immediately - no auto-loading
    return;
}

// Make it available in the browser console
if (typeof window !== 'undefined') {
    (window as any).loadDemoPhotos = loadDemoPhotos;
    (window as any).checkUserPhotos = checkUserPhotos;
}
