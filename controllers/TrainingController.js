import VideoCatalogModel from '../models/VideoCatalog.js';

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

export const getOne = async (req, res) => {
    try {

        const videoId = req.params.id;

        const videoList = await VideoCatalogModel.findById(
            {
                _id: videoId
            }
        )

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить писок тренировок',
        });
    }
}