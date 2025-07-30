const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { v2: cloudinary } = require('cloudinary');



const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'zapchat',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'pdf', 'doc', 'docx', 'mp4', 'mp3'],
        resource_type: 'auto',
        transformation: [{ width: 500, height: 500, crop: 'limit' }]
    }
});



const upload = multer({ storage });
module.exports = upload;