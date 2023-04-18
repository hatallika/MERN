import OnlineRehabilitationModel from "../models/OnlineRehabilitation.js";

export const getAll = async (req, res) => {
    try {
        const onlineServices = await OnlineRehabilitationModel.find();

        res.json(onlineServices);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить писок онлайн услуг',
        });
    }
}

export const create = async (req, res) => {
    try {
        const doc = new OnlineRehabilitationModel(
            req.body
            // {
            //     name: req.body.name,
            //     description: req.body.description,
            //     treatment: req.body.treatment,
            //     imageUrl: req.body.imageUrl,
            //     user:req.userId,
            // }
        );

        const service = await doc.save();
        res.json(service);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать онлайн услугу',
        });
    }
}