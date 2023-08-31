import EmployerModel from '../models/Employer.js';
import UserModel from '../models/User.js'
import bcrypt from "bcrypt";

export const create = async (req, res) => {
    try {
        const {
            fullName,
            email,
            phone,
            profession,
            description,
            achievements
        } = req.body;

        const temporaryPassword = await bcrypt.hash("placeholder", 10);


        const user = await new UserModel({
            fullName,
            email,
            passwordHash: temporaryPassword,
            role: 'employer',
        });

        await user.save();

        if (!user) {
            return res.status(500).json({
                message: 'Не удалось создать сотрудника!',
            });
        }

        const employer = await new EmployerModel({
            userId: user._id,
            phone,
            profession,
            description,
            achievements
        });

        await employer.save();

        res.status(201).json({message: 'Сотрудник успешно создан.', employer: employer});

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать сотрудника',
        });
    }
}

export const remove = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: 'Сотрудник не найден'
            });
        }

        await EmployerModel.findOneAndDelete({userId: userId});

        await UserModel.findByIdAndDelete(userId);

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.join({
            message: 'Не удалось удалить сотрудника'
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const employerId = req.params.id; //вытащили динамический параметр из запроса /employers/:id

        EmployerModel.findOne(
            {
                _id: employerId, // найти по id
            },
        ).populate('user').then(
            doc => {
                res.json(doc);
            },
        ).catch(err => {
            console.log(err);
            return res.status(404).json({
                message: 'Сотрудник не найден',
            });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось найти сотрудника'
        });
    }
};

export const update = async (req, res) => {
    try {
        const employerId = req.params.id;

        await EmployerModel.updateOne(
            {
                _id: employerId,
            },
            {
                profession: req.body.profession,
                imageUrl: req.body.imageUrl,
                user: req.body.user,
                description: req.body.description,
                text: req.body.text,
                certificates: req.body.certificates,
            },
        ).then(() => {
            res.json({
                access: true,
            });
        }).catch(err => {
            console.log(err);
            res.status(404).json({
                message: 'Сотрудник не найден'
            });
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось обновить данные сотрудника',
        });
    }
}