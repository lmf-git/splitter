const express = require('express');
const ffmpeg = require('ffmpeg');
const multer  = require('multer');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.urlencoded({ extended: true }));

// req.file is the name of your file in the form above, here 'uploaded_file'
// req.body will hold the text fields, if there were any 
app.post('/video', upload.single('video_input'), (req, res) => {
    const result = { status: 'error', message: null };

    // Push video buffer into ffmpeg to start manipulating it.
    // https://www.npmjs.com/package/ffmpeg

    try {
        console.log(req.file);
        new ffmpeg('./uploads/' + req.file.filename, function (err, video) {
            if (!err) {
                console.log('The video is ready to be processed');
                console.log(video);
            } else {
                console.log('Error: ' + err);
            }
        });

        result.status = 'success';

    } catch(e) {
        result.message = e.message;
    }

    return res.status(200).json(result);
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