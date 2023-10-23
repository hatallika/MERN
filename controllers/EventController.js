import EventModel from "../models/Event.js";
// Если понадобится разделить Appointments на Заявки на прием и События в календаре.
// import mongoose from "mongoose";

export const create = async (req, res) => {
    try {
        const doc = new EventModel({
            title: req.body.title,
            start: req.body.start,
            end: req.body.end
        });

        const event = await doc.save();
        res.json(event);
    } catch (err){
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать событие',
        });
    }
}

export const update = async (req, res) => {
    try {
        const eventId = req.params.id;

        await  EventModel.updateOne(
            {
                _id: eventId,
            },
            {
                title: req.body.title,
                start: req.body.start,
                end: req.body.end
            },
        ).then(() => {
            res.json({
                access: true,
            });
        }).catch(err => {
            console.log(err);
            res.status(404).json({
                message: 'Статья не найдена'
            });
        });

    } catch (err){
        console.log(err);
        res.status(500).json({
            message: 'Не удалось обновить статью',
        });
    }
}

export const remove = async (req, res) => {
    try {
        const eventId = req.params.id;

        EventModel.findOneAndDelete({
            _id: eventId,
        },).then(() => {
            res.json({
                success: true,
                message: 'Событие удалено!'
            })
        }).catch(err => {
            console.log(err);
            res.status(404).json({
                message: 'Событие не найдено!'
            });
        });
    } catch (err) {
        console.log(err);
        res.join({
            message: 'Не удалось удалить событие'
        })
    }
}

//пример агрегации по нескольким условиям
// export const getByEmployer = async (req, res) => {
//     try {
//         const employerId = req.params.id; //вытащили динамический параметр из запроса
//         const eventsWithAppointment = await EventModel.aggregate([
//             {
//
//                 // new mongoose.Types.ObjectId('64e87b84cfd59462534dd128')
//                 $lookup: {
//                     from: 'appointments',
//                     localField: '_id',
//                     foreignField: 'eventId',
//                     as: 'appointment',
//
//                     //добавили условие
//                     pipeline: [ {
//                         $match: {
//                             $expr: { $eq: [ "$employer", new mongoose.Types.ObjectId(employerId)] }
//                         }
//                     } ],
//                 }
//             },
//             {
//                 $unwind: '$appointment'
//             },
//
//         ]);
//         res.json(eventsWithAppointment);
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({
//             message: 'Не удалось получить список событий из заявок',
//         });
//     }
// };

