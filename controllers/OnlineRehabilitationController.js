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