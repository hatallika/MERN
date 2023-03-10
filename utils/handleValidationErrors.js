import {validationResult} from "express-validator";

export default (req, res, next) => {
    const errors = validationResult(req); //вытащить все ошибки из запроса
    //если валидация не прошла, вернет ошибку, если прошла, идем далее
    if (!errors.isEmpty()){
        return res.status(400).json(errors.array());
    }

    next();
}