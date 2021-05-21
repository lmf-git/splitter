const express = require('express');
const ffmpeg = require('ffmpeg-static');
const multer  = require('multer');

const app = express();
const upload = multer();

app.use(express.urlencoded({ extended: true }));

// req.file is the name of your file in the form above, here 'uploaded_file'
// req.body will hold the text fields, if there were any 
app.post('/video', upload.single('video_input'), function (req, res) {

    // Push video buffer into ffmpeg to start manipulating it.

    console.log(req.file, req.body);

    return res.status(200).json({ 
        status: 'success' 
    });
});

app.use('/', (req, res) => res.status(200).json({ 
    status: 'success' 
}));

// error handlers
app.use((err, req, res, next) => {
    res.
        status(err.status || 500)
        .json('error', { message: err.message, error: err });
});

app.listen(3000, () => console.log(`Express server listening on port 3000`));

module.exports = app;