const multer = require('multer');
const fs = require('fs');
const path = require('path');

const FILE_TYPE_MAP = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/webp': 'webp'
};

const uploadFolder = path.join(__dirname, '../public/image');

if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const ext = FILE_TYPE_MAP[file.mimetype];
        if (!ext) {
            return cb(new Error('Invalid file type'), null);
        }
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        const ext = FILE_TYPE_MAP[file.mimetype];
        const filename = `img_${Date.now()}.${ext}`;
        cb(null, filename);
    }
});

const uploadOption = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

module.exports = uploadOption;
