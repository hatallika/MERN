import ConsultationTopicModel from "../models/ConsultationTopic.js";

export const getAll = async (req, res) => {
    try {
        const topics = await ConsultationTopicModel.find().exec();
        res.json(topics);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить список консультаций',
        });
    }
}