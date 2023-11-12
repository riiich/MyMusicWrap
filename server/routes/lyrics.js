const router = require('express').Router();
const lyricsFinder = require('lyrics-finder');

router.use((req, res, next) => {
    console.log(`Retrieving lyrics for the song: ${req.query.songName}`);

    next();
});

router.get('/', async (req, res) => {

});

module.exports = router; 