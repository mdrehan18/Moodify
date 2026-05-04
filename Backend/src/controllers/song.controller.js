const songModel = require("../models/song.model")
const storageService = require("../services/storage.service")
const id3 = require("node-id3")


async function uploadSong(req, res) {

    const songBuffer = req.file.buffer
    const { mood } = req.body

    const tags = id3.read(songBuffer)

    const [ songFile, posterFile ] = await Promise.all([
        storageService.uploadFile({
            buffer: songBuffer,
            filename: tags.title + ".mp3",
            folder: "/cohort-2/moodify/songs"
        }),
        storageService.uploadFile({
            buffer: tags.image.imageBuffer,
            filename: tags.title + ".jpeg",
            folder: "/cohort-2/moodify/posters"
        })
    ])

    const song = await songModel.create({
        title: tags.title,
        url: songFile.url,
        posterUrl: posterFile.url,
        mood
    })

    res.status(201).json({
        message: "song created successfully",
        song
    })

}

async function getSong(req, res) {
    try {
        const { mood } = req.query;

        if (!mood) {
            return res.status(400).json({ message: "Mood query parameter is required." });
        }

        const songs = await songModel.aggregate([
            { $match: { mood: { $regex: new RegExp(`^${mood}$`, 'i') } } },
            { $sample: { size: 1 } }
        ]);

        if (!songs || songs.length === 0) {
            return res.status(200).json({
                message: "No song found for this mood.",
                song: null,
            });
        }

        res.status(200).json({
            message: "Random song fetched successfully.",
            song: songs[0],
        });
    } catch (error) {
        console.error("Error fetching random song:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


module.exports = { uploadSong, getSong }