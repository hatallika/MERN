import AppointmentModel from "../models/Appointment.js";
import jwt from "jsonwebtoken";

export const getAll = async (req, res) => {
    try {
        const appointments = await AppointmentModel.find().populate('service customer employer').exec(); //связь с user

        res.json(appointments);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить записи',
        });
    }
}

export const getOne = async (req, res) => {
    try {
        const appointmentId = req.params.id; //вытащили динамический параметр из запроса /appointment/:id


        AppointmentModel.findOne(
            {
                _id: appointmentId, // найти по id
            },

        ).populate('service').then(
            doc => {
                // console.log(doc);
                res.json(doc);//вернем документ (статья)
            },
        ).catch(err => {
            console.log(err);
            return res.status(404).json({
                message: 'Запись не найдена',
            });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось найти запись'
        });
    }
};

export const remove = async (req, res) => {
    try {
        const appointmentId = req.params.id;

        AppointmentModel.findOneAndDelete({
            _id: appointmentId,
        }, ).then( () => {
            res.json({
                success:true,
            })
        }).catch(err => {
            console.log(err);
            res.status(404).json({
                message: 'Запись не найдена'
            });
        });
    } catch(err){
        console.log(err);
        res.join({
            message: 'Не удалось удалить запись'
        })
    }
}

export const create = async (req, res) => {
    try {
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, ''); // удалили Bearer  в ответе Insomnia по Auth - Bearer запросу

        if (token) {
            const decoded = jwt.verify(token, 'secret123');
            req.userId = decoded._id; //если авторизован запишем userid клиента
        }

        const doc = new AppointmentModel({
            firstName: req.body.firstName,
            secondName: req.body.secondName,
            patronymic: req.body.patronymic,
            phone: req.body.phone,
            email: req.body.email,
            user: req.userId,
            service: req.body.service,
            customer: req.body.customer,
            employer: req.body.employer,
            text: req.body.text,
            dateTime: req.body.dateTime,
        });

        const appointment = await doc.save();
        res.json(appointment);
    } catch (err){
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать запись',
        });
    }
}

export const update = async (req, res) => {
    try {
        const customerId = req.params.id;

        await  AppointmentModel.updateOne(
            {
                _id: customerId,
            },
            {
                firstName: req.body.firstName,
                secondName: req.body.secondName,
                patronymic: req.body.patronymic,
                phone: req.body.phone,
                email: req.body.email,
                user: req.userId,
                service: req.body.service,
                customer: req.body.customer,
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
                message: 'Запись не найдена'
            });
        });

    } catch (err){
        console.log(err);
        res.status(500).json({
            message: 'Не удалось обновить запись',
        });
    }
}