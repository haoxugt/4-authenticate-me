const AWS = require("aws-sdk");
const multer = require("multer");
AWS.config.update({
    accessKeyId:process.env.S3_KEY,
    secretAccessKey:process.env.S3_SECRET,
});
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
const NAME_OF_BUCKET = process.env.S3_BUCKET;

const singleFileUpload = async ({ file, public = false }) => {
    const { originalname, buffer } = file;
    const path = require("path");

    // Set the name of the file in your S3 bucket to the date in ms plus the extension name.
    const Key = originalname.substring(0, originalname.lastIndexOf(".")) + '_' + new Date().getTime().toString() + path.extname(originalname);
    const uploadParams = {
        Bucket: NAME_OF_BUCKET,
        Key: public ? `public/${Key}` : Key,
        Body: buffer
    };
    const result = await s3.upload(uploadParams).promise();s3.up


    // Return the link if public. If private, return the name of the name of the file in your
    // S3 bucket as the key in your database for subsequent retrieval.
    return public ? result.Location : result.Key;
}

const multipleFilesUpload = async ({ files, public = false}) => {
    return await Promise.all(
        files.map((file) => {
            return singleFileUpload({file, public});
        })
    );
};

// Enable retrieving of private files
const retrievePrivateFile = (key) => {
    let fileUrl;
    if (key) {
        fileUrl = s3.getSignedUrl("getObject", {
            Bucket: NAME_OF_BUCKET,
            Key: key
        });
    }
    return fileUrl ||  key;
};

const storage = multer.memoryStorage({
    destination: function (req, file, callback) {
        callback(null, "");
    }
})

const singleMulterUpload = (nameOfKey) =>
    multer({ storage: storage }).single(nameOfKey);
const multipleMulterUpload = (nameOfKey) =>
    multer({ storage: storage}).array(nameOfKey);

module.exports = {
    s3,
    singleFileUpload,
    multipleFilesUpload,
    retrievePrivateFile,
    singleMulterUpload,
    multipleMulterUpload
};
