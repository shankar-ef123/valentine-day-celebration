import { addPhoto } from './db/photoDatabase';

/**
 * Utility script to add photos from the public folder to IndexedDB
 * This script converts image files to base64 and stores them in the database
 */

const PHOTO_MAPPINGS = [
    {
        id: 'ammu_dogfilter',
        filename: 'ammu_dogfilter.jpg',
        caption: 'My Cute Ammu 🐕'
    },
    // Add more mappings as photos are added
];

async function loadImageAsBase64(imagePath: string): Promise<string> {
    try {
        const response = await fetch(imagePath);
        const blob = await response.blob();

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    resolve(reader.result);
                } else {
                    reject(new Error('Failed to convert image to base64'));
                }
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error(`Error loading image ${imagePath}:`, error);
        throw error;
    }
}

export async function populatePhotosFromPublicFolder() {
    console.log('Starting to populate photos from public folder...');

    for (const mapping of PHOTO_MAPPINGS) {
        try {
            const imagePath = `/${mapping.filename}`;
            console.log(`Loading ${mapping.filename}...`);

            const base64Data = await loadImageAsBase64(imagePath);

            await addPhoto({
                id: mapping.id,
                dataUrl: base64Data,
                uploadedAt: new Date(),
                caption: mapping.caption
            });

            console.log(`✓ Successfully added ${mapping.caption}`);
        } catch (error) {
            console.error(`✗ Failed to add ${mapping.caption}:`, error);
        }
    }

    console.log('Photo population complete!');
}

// Export for use in browser console or component
(window as any).populatePhotos = populatePhotosFromPublicFolder;
