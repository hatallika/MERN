import PatientCardModel from "../models/PatientCard.js";

export const createPatientCard = async (req, res) => {

    const {userId} = req.body

    try {
        const existingCard = await PatientCardModel.findOne({userId});

        if (existingCard) {
            console.log('Карточка уже существует!');
            return res.status(200).json(existingCard);
        }

        const card = new PatientCardModel({
            userId: req.body.userId,
        });

        const newCard = await card.save();
        res.json(newCard);

    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'Не удалось создать карточку пациента!',
        });
    }
}

export const getAll = async (req, res) => {
    try {

        const patients = await PatientCardModel.find().exec()

        res.json(patients)

    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'Не удалось получить список пациентов!',
        });
    }
}

export const updatePatientCard = async (req, res) => {
    try {

        const cardId = req.params.cardId;
        const {employerId, catalogVideoId, recommendations} = req.body;

        const patientCard = await PatientCardModel.findByIdAndUpdate(cardId, {
              employerId,
              catalogVideoId,
              recommendations,
            }, { new: true });

        await patientCard.save();

        return res.json({message: 'Карта пациента успешно обновлена'});

    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'Не удалось обновить карточку пациента!',
        });
    }
}