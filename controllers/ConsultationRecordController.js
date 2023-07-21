import ConsultationRecordModel from "../models/ConsultationRecord.js";

export const create = async (req, res) => {
    try {

        const doc = new ConsultationRecordModel({
            topic: req.body.topic,
            clientName: req.body.clientName,
            clientEmail: req.body.clientEmail,
            clientPhone: req.body.clientPhone,
            additionalInfo: req.body.additionalInfo,
        });

        const consultations = await doc.save();
        res.json(consultations);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось записаться на консультацию',
        });
    }
}

export const getAll = async (req, res) => {
    try {
        const consultations = await ConsultationRecordModel.find().exec();

        res.json(consultations);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить список заявок',
        });
    }
}

//Выгрузка по дате ???