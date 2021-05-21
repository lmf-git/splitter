OBJECTIVE:

1. Input video file and desired # parts
2. Split into parts
3. Save

ISSUE:
https://github.com/eugeneware/ffmpeg-static
Because ffmpeg-static will download a binary specific to the OS/platform, you need to purge node_modules before (re-)packaging your app for a different OS/platform (read more in #35).