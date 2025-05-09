
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Set storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
    }
});

// check file type
const fileFilter = (req, file, cb) => {
    //  only images allow
    const fileTypes = /jpeg|jpg|png|gif/;
    console.log('file type =',fileTypes);
    

    //  extension check
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    console.log('ext name=',extname);
    

    //  mime type Check
    const mimetype = fileTypes.test(file.mimetype);
    console.log('mime type=',mimetype);
    

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Error: Images only! Allowed types: jpeg, jpg, png, gif'), false);
    }
};

module.exports = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // 10MB limit
    fileFilter: fileFilter
});