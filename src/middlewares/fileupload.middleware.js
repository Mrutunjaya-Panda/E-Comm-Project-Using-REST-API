//we will use multer middleware for handling file uploads in our application. Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.

import multer from 'multer';

// import path from 'path';
// import fs from 'fs';
// //for better checking of file uploads, we will also use path and fs modules of node.js.
// const uploadPath = path.join(process.cwd(), 'uploads');

// // ensure folder exists
// if (!fs.existsSync(uploadPath)) {
//     fs.mkdirSync(uploadPath, { recursive: true });
// }

// configure multer storage options
const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, './uploads/'); // specify the destination folder for uploaded files
        //cb(null, 'uploads/');
    },
    filename: (req,file,cb) =>{
        //const name = new Date().toISOString() + file.originalname;//error: Invalid characters in the filename, because of the colon(:) in the date string.
        //const name = Date.now() + '-' + file.originalname; this will work but it will not be human readable, so we will use the date string but we will replace the colon(:) with hyphen(-) to make it human readable and also to avoid the error of invalid characters in the filename.
        const name = new Date().toISOString().replace(/:/g, '_') + '-' + file.originalname;
        cb(null, name); 
    },
});

const upload = multer({storage: storage});

export default upload;