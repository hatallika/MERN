import VideoCatalogModel from '../models/VideoCatalog.js';
import VideoModel from "../models/Video.js";

export const getCatalog = async (req, res) => {
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

        const foundCatalog = await VideoCatalogModel.findById(id).populate('videos');

        if (!foundCatalog) {
            res.status(404).json({
                message: 'Каталог не найден',
            });
        }

        const videosId = foundCatalog.videos

        //$in выбирает все документы, в которых значение поля содержится в массиве значений.
        const videoList = await VideoModel.find({_id: {$in: videosId}})

        res.json(videoList)

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
            category: req.body.category
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
        const doc = new VideoModel(
            {
                title: req.body.title,
                description: req.body.description,
                videoUrl: req.body.videoUrl,
                category: req.body.category
            }
        );

        const video = await doc.save()
        const catalog = await VideoCatalogModel.findOne({category: doc.category});

        if (catalog) {
            catalog.videos.push(video._id)
            await catalog.save();
        }

        res.status(200).json({
            message: "Видео добавлено!",
            video: video
        });

    } catch
        (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать видео',
        });
    }
}