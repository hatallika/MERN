import WorkTimeModel from "../models/WorkTime.js";

export const getAll = async (req, res) => {
    try {
        const workTime = await WorkTimeModel.find().populate('employer').exec(); //связь с user

        res.json(workTime);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить записи',
        });
    }
}

export const getByEmployer = async (req, res) => {
    try {
        const employerId = req.params.id;
        const workTime = await WorkTimeModel.find({employer: employerId}).exec();
        res.json(workTime);
    } catch (err){
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить рабочие часы сотрудника',
        });
    }
}

export const removeDateForUser = async (req, res) => {
    try {
        const employer = req.body.employer;
        const removeDate = req.body.dateTime

        WorkTimeModel.findOneAndUpdate(
            {
                employer: employer,
        },
            {"$pull" : removeDate} )
            .then( () => {
            res.json({
                success:true,
            })
        }).catch(err => {
            console.log(err);
            res.status(404).json({
                message: 'Время для удаления не найдено'
            });
        });
    } catch(err){
        console.log(err);
        res.join({
            message: 'Не удалось удалить указаное время'
        })
    }
}

export const create = async (req, res) => {
    try {
        const doc = new WorkTimeModel({
            employer: req.body.employer,
            workTime: req.body.workTime,
        });

        const workTime = await doc.save();
        res.json(workTime);
    } catch (err){
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать рабочее время',
        });
    }
}

export const update = async (req, res) => {
    try {
        const workTimeId = req.params.id;

        await  WorkTimeModel.updateOne(
            {
                _id: workTimeId,
            },
            {
                employer: req.body.employer,
                dateTime: req.body.dateTime,
            },
        ).then(() => {
            res.json({
                access: true,
            });
        }).catch(err => {
            console.log(err);
            res.status(404).json({
                message: 'Рабочее время не найдено для обновления'
            });
        });

    } catch (err){
        console.log(err);
        res.status(500).json({
            message: 'Не удалось обновить рабочее время',
        });
    }
}