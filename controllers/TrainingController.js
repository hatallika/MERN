import VideoCatalogModel from '../models/VideoCatalog.js';
import VideoModel from "../models/Video.js";

export const getAll = async (req, res) => {
    try {
        const trainingList = await VideoCatalogModel.find();

        res.json(trainingList);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить писок тренировок',
        });
    }
}

export const getVideos = async (req, res) => {
    try {
        const id = req.params.id;

        const foundVideos = await VideoModel.find(
            {
                catalog: id
            }
        ).populate('VideoCatalog')

        res.json(foundVideos);

        console.log(id)
        console.log(foundVideos)

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить писок тренировок',
        });
    }
}

export const createCatalog = async (req, res) => {
    try {

        const doc = new VideoCatalogModel({
            name: req.body.name,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            // category: req.body.category,
        })

        const catalog = await doc.save();
        res.json(catalog);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать каталог видео',
        });
    }
}

export const createVideo = async (req, res) => {
    try {
        const catalog = await VideoCatalogModel.findById(req.body.catalog);

        const doc = new VideoModel(
            // req.body
            {
                title: req.body.title,
                description: req.body.description,
                videoUrl: req.body.videoUrl,
                catalog: catalog
            }
        );

        const video = await doc.save();
        res.json(video);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать видео',
        });
    }
}