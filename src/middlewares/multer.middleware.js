// Importing multer, a middleware for handling multipart/form-data, commonly used for file uploads.
import multer from "multer";

// Configuring storage options for multer using diskStorage.
const storage = multer.diskStorage({
    // Setting the destination where uploaded files will be stored temporarily.
    destination: function (req, file, cb) {
        // Storing files in the "public/temp" directory.
        cb(null, "./public/temp");
    },

    // Setting the filename for the uploaded file.
    filename: function (req, file, cb) {
        // Using the original name of the uploaded file.
        cb(null, file.originalname);
    },
});

// Creating an instance of multer with the specified storage configuration.
export const upload = multer({ 
    storage, // Passing the storage configuration to multer.
});
