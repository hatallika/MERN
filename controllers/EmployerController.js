import EmployerModel from '../models/Employer.js';

export const getAll = async (req, res) => {
    try {
        const employers = await EmployerModel.find().populate('user').exec(); //связь с user
        res.json(employers);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить список сотрудников',
        });
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

export const remove = async (req, res) => {
    try {
        const employerId = req.params.id;

        EmployerModel.findOneAndDelete({
            _id: employerId,
        }, ).then( () => {
            res.json({
                success:true,
            })
        }).catch(err => {
            console.log(err);
            res.status(404).json({
                message: 'Сотрудник не найден'
            });
        });
    } catch(err){
        console.log(err);
        res.join({
            message: 'Не удалось удалить сотрудника'
        })
    }
}

export const create = async (req, res) => {
    try {
        const doc = new EmployerModel({
            profession: req.body.profession,
            imageUrl: req.body.imageUrl,
            user: req.body.user,
            description: req.body.description,
            text: req.body.text,
            certificates: req.body.certificates,
        });

        const employer = await doc.save();
        res.json(employer);
    } catch (err){
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать сотрудника',
        });
    }
}

export const update = async (req, res) => {
    try {
        const employerId = req.params.id;

        await  EmployerModel.updateOne(
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

    } catch (err){
        console.log(err);
        res.status(500).json({
            message: 'Не удалось обновить данные сотрудника',
        });
    }
}