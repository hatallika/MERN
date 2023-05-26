import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";
import PostModel from "../models/Post.js";

export const register = async (req, res) => {
    try {

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10); //генерируем соль
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName:  req.body.fullName,
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
    } catch (err){
        console.log(err);
        res.status(500).json({
            message: 'Не удалось зарегистрироваться',
        })
    }
};

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email});

        if(!user){
            return res.status(404).json({
                message: 'Пользователь не найден', //лучше не уточнять почему от брутфорса
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash); //сравниваем введеный пароль с паролем в БД дешифруя

        if (!isValidPass){
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

    } catch (err){
        console.log(err);
        res.status(500).json({
            message: 'Не удалось авторизоваться',
        })
    }
};

export const getMe = async (req,res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if(!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            });
        }
        //если пользователь найден
        const {passwordHash, ...userData} = user._doc;

        res.json(userData);

    } catch (err){
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

export const getCustomers = async (req, res) => {
    try {
        const customers = await UserModel.find({'role' : 'customer'}).populate('customer').exec(); //связь с user

        res.json(customers);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить покупателей',
        });
    }
}