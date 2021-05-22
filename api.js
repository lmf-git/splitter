const express = require('express');
const ffmpeg = require('ffmpeg');
const multer = require('multer');
const fs = require('fs');

const app = express();

const cleanup = () => {
    // Read uploads/ and splitted/ delete everything in both.
    const uploadsDir = fs.readdirSync('./uploads');
    console.log(uploadsDir);
}

// Push video buffer into ffmpeg to start manipulating it.
// https://www.npmjs.com/package/ffmpeg

// TODO: Add buttons for opening uploads and splitted folders in finder/my documents
// TODO: Causes error when packaged - https://stackoverflow.com/questions/60881343/electron-problem-creating-file-error-erofs-read-only-file-system
const upload = multer({ dest: 'uploads/' });

app.use(express.urlencoded({ extended: true }));

// req.file is the name of your file in the form above, here 'uploaded_file'
// req.body will hold the text fields, if there were any 
app.post('/video', upload.single('video_input'), async (req, res) => {
    // TODO: Clear the uploads/splitted directories here... easiest way forward.
    cleanup();

    console.log('Request received.');

    const result = { status: 'error', message: null };

    const numParts = isNaN(parseInt(req.body.parts_input)) ?
        parseInt(req.body.parts_input) : 2;

    try {
        const splittingTaskIndices = [];
        for (let i = 0; i < numParts; i++) splittingTaskIndices.push(null);
        const splittingTasks = splittingTaskIndices.map(async (p, pIndex) => 
            new Promise((resolve, reject) => 
                new ffmpeg('./uploads/' + req.file.filename, (err, video) => {
                    if (err) return reject(err);

                    console.log('Splitting video into part: ', pIndex + 1);

                    // Global chunk/part info.
                    const duration = video.metadata.duration.seconds;
                    const partDuration = Math.round(duration / numParts);
                    
                    // Update the video to the adjusted start time (returns Video type).
                    video.setVideoStartTime(pIndex * partDuration);

                    // Trim the ending
                    video.setVideoDuration(partDuration);
            
                    // Step 2/2: Save parts.
                    const fileSavePath = video.file_path.replace('/uploads/', '/splitted/');
                    const fileWithExtPath = `${fileSavePath}-${pIndex + 1}.mp4`;
                    video.save(fileWithExtPath, (error, file) => {
                        if (!error) resolve(file);
                        else reject(error);
                    });
                })
            )
        );

        // Should contain data about failure/success of each part.
        const splitTaskResults = await Promise.all(splittingTasks);
        console.log(splitTaskResults.every(t => !!t));

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