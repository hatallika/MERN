import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";
import fs from 'fs';
import path from 'path';
import randomstring from "randomstring";
import nodemailer from "nodemailer";

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

export const getAllEmployers = async (req, res) => {
    try {
        const usersWithEmployers = await UserModel.aggregate([
            {
                $match: { role: "employer" } // Выбираем только пользователей-сотрудников
            },
            {
                $lookup: {
                    from: 'employers',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'employer'
                }
            },
            {
                $unwind: '$employer'
            }
        ]);
        res.json(usersWithEmployers);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить список пользователей со сведениями о сотрудниках',
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

        // токен и время жизни
        user.resetPasswordToken = jwt.sign({userId: user._id}, 'my_secret_key', {expiresIn: '1h'});
        user.resetPasswordExpires = Date.now() + (24 * 60 * 60 * 1000); //24 часа

        await user.save();

        const transporter = nodemailer.createTransport({
            host: 'smtp.beget.com',
            port: 25,
            auth: {
                user: 'info@bodybalance-doc.ru',
                pass: 'ZJD&edJ2'
            }
        });

        transporter.verify(function (error) {
            if (error) {
                console.log(error);
            } else {
                console.log("Server is ready to take our messages");
            }
        });

        const mailOptions = {
            from: 'info@bodybalance-doc.ru',
            to: user.email, // Адрес получателя
            subject: 'Смена пароля для новой учетной записи bodybalance-doc.ru', // Тема письма
            text: `Привет,

                Мы получили запрос на смену пароля для вашей учетной записи. Чтобы изменить пароль, пожалуйста, перейдите по следующей ссылке:

                http://localhost:3000/reset-password/${encodeURIComponent(user.resetPasswordToken)}

                Если вы не запрашивали смену пароля, пожалуйста, проигнорируйте это сообщение.

                С уважением,
                Команда Bodybalance`
        };

        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Ошибка отправки письма: ', error);
            } else {
                console.log('Письмо успешно отправлено: ', info);
            }
        });

        res.status(200).json({message: 'Пользователь успешно создан!', user});

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать временного пользователя!',
        });
    }
}

export const resetPassword = async (req, res) => {

    const token = req.params.token;
    const newPassword = req.body.newPassword;

    if (token){
        try {
            const decoded = jwt.verify(token, 'my_secret_key');

            const user = await UserModel.findById(decoded.userId);

            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден!' });
            }

            if (Date.now() > user.resetPasswordExpires) {
                return res.status(400).json({ message: 'Срок действия ссылки истек!' });
            }

            const salt = await bcrypt.genSalt(10);

            user.passwordHash = await bcrypt.hash(newPassword, salt);
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;

            await user.save();

            res.status(200).json({ message: 'Пароль успешно обновлен!' });
        } catch (e) {
            console.log(e);
            res.status(500).json({
                message: 'Не удалось обновить пароль пользователя!',
            });
        }
    }
}


export const remove = async (req, res) => {
    try {
        const userId = req.params.id;

        UserModel.findOneAndDelete({
            _id: userId,
        },).then(() => {
            res.json({
                success: true,
                message: 'Пациент удален!'
            })
        }).catch(err => {
            console.log(err);
            res.status(404).json({
                message: 'Пациент не найден!'
            });
        });
    } catch (err) {
        console.log(err);
        res.join({
            message: 'Не удалось удалить пациента'
        })
    }
}