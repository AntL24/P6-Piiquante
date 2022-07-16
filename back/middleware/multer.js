const multer = require('multer');

const storage = multer.diskStorage({
    destination: "images/",
    filename: function (req, file, cb) {
    cb (null, fileNameCreator(req, file));
    }
})

function fileNameCreator(req, file) {
    const fileName = `${Date.now()}-${file.originalname}`.replace(/\s/g, "-"); //replace all spaces within the file names with "-"
    file.fileName = fileName;
    return fileName
}

const upload = multer({ storage });

module.exports = {upload}
