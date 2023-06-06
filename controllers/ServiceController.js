import ServiceModel from '../models/Service.js';


export const getAll = async (req, res) => {
    try {
        const services = await ServiceModel.find().populate('employer').exec();

        res.json(services);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить писок услуг',
        });
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id; //вытащили динамический параметр из запроса /posts/:id

        ServiceModel.findOneAndUpdate(
            {
                _id: postId, // найти по id
            },
            {
                $inc: { viewsCount: 1 }, //что обновить и на какое значение.
            },
            {
                returnDocument: 'after', //вернуть документ после обновления
            },

        ).then(
            doc => {
                res.json(doc);//вернем документ (статья)
            },
        ).catch(err => {
            console.log(err);
            return res.status(404).json({
                message: 'Услуга не найдена',
            });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить данные об услуге'
        });
    }
};
//популярные услуги по рейтингу
export const getByRating = async (req, res) => {
    try {
        const services = await ServiceModel.find().sort({rating: -1}).limit(3);

        res.json(services);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить писок услуг',
        });
    }
}




export const remove = async (req, res) => {
    try {
        const serviceId = req.params.id;

        ServiceModel.findOneAndDelete({
            _id: serviceId,
        }, ).then( () => {
            res.json({
                success:true,
            })
        }).catch(err => {
            console.log(err);
            res.status(404).json({
                message: 'Услуга не найдена'
            });
        });
    } catch(err){
        console.log(err);
        res.join({
            message: 'Не удалось удалить Услугу'
        })
    }
}

export const create = async (req, res) => {
    try {
        const doc = new ServiceModel({
            name: req.body.name,
            description: req.body.description,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            price: req.body.price,
            rating:req.body.rating,
            user: req.userId, // сотрудник, не из запроса пользователя, а с бекенда из проверки на авторизацию (checkAuth.js)
            employer: req.body.employer,
        });

        const service = await doc.save();
        res.json(service);
    } catch (err){
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать услугу',
        });
    }
}

export const update = async (req, res) => {
    try {
        const serviceId = req.params.id;

        await  ServiceModel.updateOne(
            {
                _id: serviceId,
            },
            {
                name: req.body.name,
                description: req.body.description,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                price: req.body.price,
                rating:req.body.rating,
                employer: req.body.employer,
            },
        ).then(() => {
            res.json({
                access: true,
            });
        }).catch(err => {
            console.log(err);
            res.status(404).json({
                message: 'Услуга не найдена'
            });
        });

    } catch (err){
        console.log(err);
        res.status(500).json({
            message: 'Не удалось обновить данные услуги',
        });
    }
}