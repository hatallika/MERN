import CustomerModel from "../models/Customer.js";

export const getAll = async (req, res) => {
    try {
        const customers = await CustomerModel.find().populate('user').exec(); //связь с user

        res.json(customers);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить покупателей',
        });
    }
}

export const getOne = async (req, res) => {
    try {
        const customerId = req.params.id; //вытащили динамический параметр из запроса /customer/:id

        CustomerModel.findOne(
            {
                _id: customerId, // найти по id
            },

        ).populate('user').then(
            doc => {
                // console.log(doc);
                res.json(doc);//вернем документ (статья)
            },
        ).catch(err => {
            console.log(err);
            return res.status(404).json({
                message: 'Покупатель не найден',
            });
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось найти покупателя'
        });
    }
};


export const getOneByEmail = async (req, res) => {
    try {
        const customerEmail = req.query.email;

        CustomerModel.findOne(
            {
                email: customerEmail,
            },

        ).then(
            doc => {
                res.json(doc);//вернем документ (статья)
            },
        ).catch(err => {
            console.log(err);
            return res.status(404).json({
                message: 'Покупатель не найден',
            });
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось найти покупателя'
        });
    }
};

export const getOneByPhone = async (req, res) => {
    try {
        const customerPhone = req.query.phone;

        CustomerModel.findOne(
            {
                phone: customerPhone,
            },

        ).then(
            doc => {
                res.json(doc);//вернем документ (статья)
            },
        ).catch(err => {
            console.log(err);
            return res.status(404).json({
                message: 'Покупатель не найден',
            });
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось найти покупателя'
        });
    }
};



export const remove = async (req, res) => {
    try {
        const customerId = req.params.id;

        CustomerModel.findOneAndDelete({
            _id: customerId,
        }, ).then( () => {
            res.json({
                success:true,
            })
        }).catch(err => {
            console.log(err);
            res.status(404).json({
                message: 'Покупатель не найден'
            });
        });
    } catch(err){
        console.log(err);
        res.join({
            message: 'Не удалось удалить покупателя'
        })
    }
}

export const create = async (req, res) => {
    try {
        const doc = new CustomerModel({
            firstName: req.body.firstName,
            secondName: req.body.secondName,
            patronymic: req.body.patronymic,
            phone: req.body.phone,
            email: req.body.email,
            user: req.userId, // авторизованный пользователь, не из запроса пользователя, а с бекенда из проверки на авторизацию (checkAuth.js)
        });

        const customer = await doc.save();
        res.json(customer);
    } catch (err){
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать покупателя',
        });
    }
}

export const update = async (req, res) => {
    try {
        const customerId = req.params.id;

        await  CustomerModel.updateOne(
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

export const findByUser = async (req,res) => {
    try {
        const userId = req.params.user;

        CustomerModel.find({user: userId}).then(
            doc => {
                res.json(doc);
            },
        ).catch(err => {
            console.log(err);
            res.status(404).json({
                message: 'Пользователь не найден'
            });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Такой пользователь не найден среди покупателей',
        });
    }
}