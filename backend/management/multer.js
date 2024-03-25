const multer = require('multer');

const FILE_TYPES = {
    'image/png':'png',
    'image/jpeg':'jpeg',
    'image/webp':'webp',
    'image/jpg':'jpg'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let isValid = FILE_TYPES[file.mimetype];
        let uploadError = new Error('invalid image type');

        if(isValid){
            uploadError = null;
        }

        cb(uploadError, 'public/images');
    },
    filename: function(req, file, cb) {
        const filename = file.originalname.split(' ').join('-');
        const extension = FILE_TYPES[file.mimetype];
        cb(null, `${filename}-${Date.now()}.${extension}`)
    }
})

uploads = multer({storage: storage}); //uploads variable is assigned the multer middleware instance, configured with the defined storage settings.

module.exports = uploads; // uploads middleware instance is exported to be used in other parts of the application for handling file uploads.