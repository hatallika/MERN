import ServiceModel from '../models/Service.js';
import ScheduleModel from "../models/Schedule.js";
import path from "path";
import fs from "fs";

export const create = async (req, res) => {

    const {name, description, recommendations} = req.body

    try {
        const service = new ServiceModel({
            name: name,
            description: description,
            recommendations: recommendations,
            // imageUrl: req.body.imageUrl
        });

        const newService = await service.save();

        res.status(200).json({message: 'Услуга успешно добавлена!', service: newService})
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать услугу',
        });
    }
}

export const getAll = async (req, res) => {
    try {
        const services = await ServiceModel.find().exec();

        res.json(services);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить список услуг',
        });
    }
}

export const update = async (req, res) => {
    try {
        const serviceId = req.params.id;
        const editedService = req.body

        const updatedService = await ServiceModel.findByIdAndUpdate(
            {_id: serviceId},
            editedService,
            {new: true}
        );

        res.json({
            updatedSchedule: updatedService,
            message: 'Расписание обновлено!'
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось обновить данные услуги',
        });
    }
}

export const remove = async (req, res) => {
    try {
        const serviceId = req.params.id;

        if (!serviceId) {
            return res.status(404).json({
                message: 'Услуга не найдена!'
            });
        }

        await ServiceModel.findByIdAndDelete(serviceId);

        res.json({
            success: true,
            message: 'Услуга удалена!'
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось удалить услугу!',
        });
    }
}

export const updateImage = async (req, res) => {
    try {
        const serviceId = req.params.id;

        const imageUrl = `/uploads/images/services/${path.basename(req.file.filename)}`;

        const service = await ServiceModel.findById(serviceId);

        if (!service) {
            return res.status(400).json({
                message: 'Услуга не найдена!',
            });
        }

        if (service.imageUrl) {  // удаляем старую пикчу
            const existingImagePath = path.join('uploads/images/services', path.basename(service.imageUrl));

            setTimeout(() => {
                fs.unlinkSync(existingImagePath);
            }, 2000);
        }

        service.imageUrl = imageUrl;
        await service.save();

        return res.json({message: 'Картинка успешно обновлена', imageUrl: service.imageUrl});

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось загрузить картинку!',
        });
    }
}