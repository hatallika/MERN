import VideoCatalogModel from '../models/VideoCatalog.js';
import VideoModel from "../models/Video.js";
import path from "path";
import fs from "fs";


// КАТАЛОГ -----------------------
export const createCatalog = async (req, res) => {
    try {

        const catalog = new VideoCatalogModel({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category
        });

        const newCatalog = await catalog.save();

        res.status(200).json({message: 'Каталог успешно добавлен!', catalog: newCatalog});

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать видеокаталог!',
        });
    }
}

export const remove = async (req, res) => {
    try {
        const catalogId = req.params.id;

        if (!catalogId) {
            return res.status(404).json({
                message: 'Каталог не найден!'
            });
        }

        await VideoCatalogModel.findByIdAndDelete(catalogId);

        res.json({
            success: true,
            message: 'Каталог успешно удален!'
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось удалить каталог!',
        });
    }
}


export const updateCatalog = async (req, res) => {

    try {
        const catalogId = req.params.id;
        const editedCatalog = req.body

        const updatedCatalog = await VideoCatalogModel.findByIdAndUpdate(
            {_id: catalogId},
            editedCatalog,
            {new: true}
        );

        res.json({
            updatedCatalog: updatedCatalog,
            message: 'Видеокаталог обновлен!'
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось обновить данные каталога!',
        });
    }
}

export const getCatalogs = async (req, res) => {
    try {
        const trainingList = await VideoCatalogModel.find().populate('videos').exec();

        res.json(trainingList);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить писок тренировок',
        });
    }
}


// ВИДЕО -----------------------

export const createVideo = async (req, res) => {
    try {
        const video = new VideoModel(
            {
                title: req.body.title,
                description: req.body.description,
                videoUrl: req.body.videoUrl,
                category: req.body.category
            }
        );

        const newVideo = await video.save()
        const catalog = await VideoCatalogModel.findOne({category: newVideo.category});

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

export const removeVideo = async (req, res) => {
    try {
        const videoId = req.params.id;

        if (!videoId) {
            return res.status(404).json({
                message: 'Видео не найден!'
            });
        }

        await VideoModel.findByIdAndDelete(videoId);

        res.json({
            success: true,
            message: 'Видео успешно удалено!'
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось удалить видео!',
        });
    }
}

export const updateImage = async (req, res) => {
    try {
        const serviceId = req.params.id;

        const imageUrl = `/uploads/images/training/${path.basename(req.file.filename)}`;

        const training = await VideoCatalogModel.findById(serviceId);

        if (!training) {
            return res.status(400).json({
                message: 'Видеокаталог не найден!',
            });
        }

        if (training.imageUrl) {  // удаляем старую пикчу
            const existingImagePath = path.join('uploads/images/training', path.basename(training.imageUrl));

            setTimeout(() => {
                fs.unlinkSync(existingImagePath);
            }, 2000);
        }

        training.imageUrl = imageUrl;
        await training.save();

        return res.json({message: 'Картинка успешно обновлена', imageUrl: training.imageUrl});

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось загрузить фото!',
        });
    }
}
