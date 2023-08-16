import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";
import fs from 'fs';
import path from 'path';
import randomstring from "randomstring";

export const register = async (req, res) => {
    try {

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10); //генерируем соль
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        });

        const user = await doc.save(); //

        const token = jwt.sign({
                _id: user._id,
            },
            'secret123',
            { //срок жизни токена
                expiresIn: '30d',
            },
        );
        const {passwordHash, ...userData} = user._doc;

        //если ошибок нет
        res.json({
            ...userData,
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось зарегистрироваться',
        })
    }
};

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email});

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден', //лучше не уточнять почему от брутфорса
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash); //сравниваем введеный пароль с паролем в БД дешифруя

        if (!isValidPass) {
            return res.status(400).json({
                message: 'Не верный логин или пароль', //лучше не уточнять почему от брутфорса
            });
        }

        //если все ок создаем новый токен
        const token = jwt.sign({
                _id: user._id,
            },
            'secret123',
            { //срок жизни токена
                expiresIn: '30d',
            },
        );

        const {passwordHash, ...userData} = user._doc;

        //если ошибок нет
        res.json({
            ...userData,
            token,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось авторизоваться',
        })
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            });
        }

        const {passwordHash, ...userData} = user._doc;

        res.json(userData);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Нет доступа',
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const users = await UserModel.find().exec(); //связь с user

        res.json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить пользователей',
        });
    }
}

export const getAllCustomers = async (req, res) => {
    try {
        const customers = await UserModel.aggregate([
            {
                $match: {role: 'customer'}
            },
            {
                $lookup: {
                    from: "customers",
                    localField: "_id",
                    foreignField: "userId",
                    as: "customerData",
                },
            },
            {
                $sort: {"customerData.fullName": 1} // Сортировка по полю fullName в алфавитном порядке (1 для возрастания)
            }
        ]);

        res.json(customers);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить информацию о пациентах',
        });
    }
}

export const getEmployers = async (req, res) => {
    try {
        const employers = await UserModel.find({'role': 'employer'}).populate('employer').exec(); //связь с employer

        res.json(employers);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить сотрудников',
        });
    }
}

export const update = async (req, res) => {
    try {
        const userId = req.userId;
        const avatarUrl = `/uploads/avatars/${path.basename(req.file.filename)}`;

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: 'Пользователь не найден',
            });
        }

        // Удаляем старую аватарку, если она была
        if (user.avatarUrl) {
            const existingAvatarPath = path.join('uploads/avatars', path.basename(user.avatarUrl));
            fs.unlinkSync(existingAvatarPath);
        }

        user.avatarUrl = avatarUrl;
        await user.save();

        return res.json({message: 'Аватарка успешно обновлена', avatarUrl: user.avatarUrl});

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось обновить сотрудников',
        });
    }
}

export const createUserAndGeneratePassword = async (req, res) => {
    try {
        const temporaryPassword = randomstring.generate(10);
        const salt = await bcrypt.genSalt(10);
        const hashTemporaryPassword = await bcrypt.hash(temporaryPassword, salt);

        const user = new UserModel({
            fullName: req.body.fullName,
            email: req.body.email,
            passwordHash: hashTemporaryPassword,
        });

        console.log(user)

        await user.save();

        res.status(200).json({message: 'Временный пользователь успешно создан!', user});

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать временного пользователя!',
        });
    }
}