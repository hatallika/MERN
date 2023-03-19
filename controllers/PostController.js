import PostModel from '../models/Post.js';

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();

        const tags = posts
            .map(obj => obj.tags)
            .flat()
            .slice(0, 5);

        res.json(tags);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи',
        });
    }
}

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec(); //связь с user

        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи',
        });
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id; //вытащили динамический параметр из запроса /posts/:id

        PostModel.findOneAndUpdate(
            {
                _id: postId, // найти по id
            },
            {
                $inc: { viewsCount: 1 }, //что обновить и на какое значение.
            },
            {
                returnDocument: 'after', //вернуть документ после обновления
            },

        ).populate('user').then(
            doc => {
                // console.log(doc);
                res.json(doc);//вернем документ (статья)
            },
        ).catch(err => {
            console.log(err);
            return res.status(404).json({
                message: 'Статья не найдена',
            });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статью'
        });
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndDelete({
            _id: postId,
        }, ).then( () => {
            res.json({
                success:true,
            })
        }).catch(err => {
            console.log(err);
            res.status(404).json({
                message: 'Статья не найдена'
            });
        });
    } catch(err){
        console.log(err);
        res.join({
            message: 'Не удалось удалить статью'
        })
    }
}

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(','),
            user: req.userId, // авторизованный пользователь, не из запроса пользователя, а с бекенда из проверки на авторизацию (checkAuth.js)
        });

        const post = await doc.save();
        res.json(post);
    } catch (err){
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать статью',
        });
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        await  PostModel.updateOne(
            {
                _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                user: req.userId,
                tags: req.body.tags.split(','),
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