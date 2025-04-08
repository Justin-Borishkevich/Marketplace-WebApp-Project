// config/cloudinary.js
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'store-images', // Folder in Cloudinary to store images
        allowed_formats: ['jpg', 'png', 'jpeg', 'gif'], // Allowed file types
        // Optional: Configure image transformations for file size reduction
        transformation: [
            { width: 800, height: 800, crop: 'limit', quality: 'auto', fetch_format: 'auto' }
        ]
    }
});

module.exports = { cloudinary, storage };